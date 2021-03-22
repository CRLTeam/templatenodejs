
const logFileName = "renderer-" + Date.now() + "-log.txt";


const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const axios = require('axios');
const serverUrl = 'http://localhost:3001';

const fs = require("fs");
// const microwave = require("./template.js");
// const tbb = require("./tbb.js");
// const context = require("./context.js").context;
// const tester = require("./test-template.js");
const { setAllTemplateDefaults, setRoles } = require('./startup.js');
const doFunction = require("./functions.js").doFunction;
const doTransition = require("./transitions.js").doTransition;
const doBroadcast = require("./transitions.js").doBroadcast;

let templateID;
let template;

//mongo server stuff

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 3001

const db = require("./database/db/db.js")
const dbRouter = require("./database/routes/router.js")

//

//states and role
let states = {};
let role = "";

let allUsers = {};

//we will temporarily have user uid created and stored here
let userUID = '444444444';

//object that will store display name and will be associated with it's machine name
let allDisplayNames = {};

/**
 * Set template
 * @param {string} tid   template ID
 */
async function setTemplate(tid) {
    //uses inputted template id and sets it to the global variable templateID
    templateID = tid;

    //retrieve template from database
    try{
        const res = await axios({
            method: 'get',
            url: `${serverUrl}/api/getTemplate/${tid}`
        }).then(response =>{
                response = response.data.data;
                let temp = response.machines; 
                let roles = response.roles;
                return {template: temp, roles: roles} 
            });
        template = res.template;
        roles = res.roles;
        return res.template;
    }catch(err){
        console.log ('ERROR: ', err)
        return false;
    }

}

/**
 * Asks user for input.
 * @param {string}   query    query string to output to user
 * @returns {Promise} promise containing user input as a string
 */
function getInput(query) {
    return new Promise((resolve, _reject) => {
        readline.question(query, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Prints all states in template.
 * @param {string}  tid     template ID, set to templateID global variable by default
 * @returns {Object} information about the request as well as the states data
 */
// function showAllStates(tid = templateID) {
//     //set current template
//     await setTemplate(tid);
//     let statesReturn = JSON.stringify(states[templateID], null, 2);
//     console.log("All states \n", statesReturn);
//     return {
//         status: "success",
//         type: "request",
//         message: "States returned successfully",
//         data: statesReturn
//     };
// }

/**
 * Get machine object from template.
 * @param {string} machine machine name
 * @param {string} tid     template ID
 * @returns {JSON} JSON object from template of specified machine
 */
function getMachine(machine, tid) {
    //set current template
    setTemplate(tid);
    return template[machine];
}

/**
 * Check if action exists.
 * @param {string} action  name of action
 * @param {string} machine name of machine
 * @param {string} tid     template ID, set to templateID global variable by default
 * @returns {boolean} true if action exists
 */
function actionExists(action, machine, role, tid = templateID) {
    setTemplate(tid);
    let currState = states[tid][machine].currentState;
    
    //if action is undefined, it means it does not exists in the current machine
    if (!template[machine].states[currState].role[role].actions[action]) {
        return false;
    } else {
        return true;
    }
}

/**
 * Executes events.
 * @param {string[]} events        string array containing events to execute
 * @param {string} machineName     machine name
 * @returns {Array}                response array
 */
async function doEvents(events, machineName, data) {
    let responseArr = [];
    let dataArr;
    let x = 0;
    //loop through each event, check type, and execute it
    for (e of events) {
        if (e.type == "transition") {
            let transition = await doTransition(machineName, e.do);
            
            responseArr.push(transition);
        } else if (e.type == "broadcast") {
            let broadcast = await doBroadcast(e.do);
            responseArr.push(broadcast);
        } else if (e.type == "function") {
            //send data when calling function
            let func = await doFunction(e.do, data, e.funcData);
            dataArr = func;
        } else if (e.type == "action") {
            //actions calling other actions will have special type 'eventCall'
            let act = doAction(e.do, machineName, "eventCall", role);
            responseArr.push(act);
        }
    }
    return {
        responses: responseArr,
        data: dataArr
    };
}

/**
 * Gets current state of specified machine
 * @param {string} machine machine name
 * @param {string} tid     template ID
 * @returns {string} name of current state for machine
 */
function getCurrState(machine, tid) {
    //set template
    setTemplate(tid);
    return states[templateID][machine].currentState;
}

/**
 * Exectues action.
 * @param {*} actionName   name of action
 * @param {*} machineName  name of machine
 * @param {string} type    type of action, "user" for actions that require permission checking
 * @param {string} role    role of user
 * @param {string} tid     template ID, set to templateID global variable by default
 * @returns {Promise}      Object containing request information
 */
async function doAction(actionName, machineName, type, role, tid = templateID, data) {
    let promise = new Promise(async (resolve, reject) => {
        let response;
        templateID = tid;
        template = await setTemplate(templateID);
        let machine = getMachine(machineName, templateID);
        if (machine == undefined) {
            reject(`Machine ${machineName} does not exist`);
            return;
        }

        //check if action exists
        if (!actionExists(actionName, machineName, role)) {
            reject(`Action "${actionName}" does not exist in the machine ${machineName}`);
            return;
        }

        //check if machine is active, if not return false
        if (states[templateID][machineName].currentState == null) {
            reject("Cannot perform action, machine is not active.");
            return;
        }

        let currentState = states[templateID][machineName].currentState;
        let action = machine.states[currentState].role[role].actions[actionName];
        let events = action.action;
        if (events == undefined) {
            events = action["global"];
            if (events == undefined) {
                reject("No action avaiable in this state");
                return;
            }
        }
        
        //find first action that has condition that is met and execute it's events
        for (const event of events) {
            //if condition is true boolean, do event
            if (event.condition === true) {
                response = await doEvents(event.events, machineName, data);
                resolve(response);
                return;
            } else {
                //if not, check conditions
                for (const idx in event.condition) {
                    let funcArgs = {func: event.condition[idx].func,
                                    args: event.condition[idx].args}
                    let checkCon = await doFunction(funcArgs);
                    if (checkCon) {
                        response = await doEvents(event.events, machineName, data);
                        resolve(response);
                        return;
                    }
                }
            }
        }
        //if none of the events resolved, return fail message
        reject("Failed to complete events");
        return;
    });
    return await promise;
}

/**
 * Search template for machines
 * @param {string}  tid     template ID
 * @returns {Array} array containing name of all machines in template
 */
function allMachines(tid) {
    setTemplate(tid);
    let machines = [];
    for (let machineName in template) {
        machines.push(machineName);
    }
    return machines;
}

/**
 * Find all available actions the user can perform in every machine in a template
 * @param {string} tid      template ID
 * @param {string} userRole the user's role, default is global variable role
 * @returns {Object} Object containing name of all machines and available actions
 */
function allAvailableActions(tid, userRole = role) {
    setTemplate(tid);
    //create display object that will be returned
    let display = {};
    //get all machine names in array
    let machines = allMachines(templateID);
    for (let machineName of machines) {
        //create object for machineName in display
        display[machineName] = {};
        //create actions array in machineName object
        display[machineName].actions = [];
        //get current state for machineName
        let currState = getCurrState(machineName, templateID);

        if (currState != false && !isNull(currState)) {
            //get machine machine object
            let machine = getMachine(machineName, templateID);
            let state = machine.states[currState];
            //Check if user has actions to perform in the state (based on their role)
            if(state.role[userRole]){
                //Loop through actions and add each action to display object
                for (let action in state.role[userRole].actions){
                    display[machineName].actions.push(action);
                }
            }
        }
    }
    return display;
}


/**
 * Find all actions in specified machine
 * @param {string} machineName  name of machine
 * @param {string} tid          template ID
 * @returns {Array, boolean} array containing all available actions in machine, false if machine does not exist
 */
async function machineAvailableActions(machineName, tid, userRole = role) {
    //set template
    templateID = tid;
    template = await setTemplate(templateID);
    //if machine does not exist, return false
    if (getMachine(machineName, templateID) == undefined) {
        return false;
    }
    return allAvailableActions(templateID, userRole)[machineName].actions;
}

/**
 * Retrieve display data for specified state
 * @param {string} machineName  name of machine
 * @param {string} tid          template ID
 * @returns {Array, boolean} array containing all available actions in machine, false if machine does not exist
 */
async function getDisplayData(machineName, tid, state, userRole = role) {
    //set template 
    templateID = tid;
    template = await setTemplate(templateID);

    let displayState = template.machines[machineName].display[state][userRole];
    if(displayState == ""){
        return {
            status: "fail",
            type: "data request",
            message: `State ${state} does not exist in machine ${machineName}.`
        };
    }
    let displayObj = [];
    for(i = 0; i < displayState.displayData.length; i++){
        let display = displayState.displayData[i];
        let keys = Object.keys(display);
        for(j = 0; j < keys.length; j++){
            let key = keys[j];
            let value;
            if(key == "button"){
                value = context[templateID].button[display[key]];
            }else{
                value = context[templateID].text[display[key]];
            }
            displayObj.push({
                [key]: value
            });
        }
    }
    console.log('Display Data: ', displayObj);

    return {
        status: "success",
        type: "data request",
        message: `Display data successfully retrieved`,
        data: displayObj
    };
}

async function getContext(contextID) {
    
    try{
        const res = await axios({
            method: 'get',
            url: `${serverUrl}/api/getContext/${contextID}`
        }).then(response =>{
                response = response.data.data;
                let context = response

                return context;
            });

        return res;
    }catch(err){
        console.log ('ERROR: ', err)
        return false;
    }

}

async function createInstance(tid, rid, states, context) {

    try{
        //create instance ID
        let instanceID = Math.floor(Math.random()*9999999);

        await axios({
            method: 'post',
            url: `${serverUrl}/api/addInstance`,
            data: {
                _id: instanceID,
                templateID: tid,
                role: rid,
                context: context,
                states: states,
                extraData: {"contextID": context}
            }
        });

        return instanceID;
    }catch(err){
        console.log ('ERROR: ', err)
        return false;
    }
} 

async function getInstance(instanceID) {
    
    try{
        const res = await axios({
            method: 'get',
            url: `${serverUrl}/api/getInstance/${instanceID}`
        }).then(response =>{
                response = response.data.data;
                let instance = {
                    templateID: response.templateID,
                    role: response.role,
                    context: response.context,
                    states: response.states,
                    extraData: response.extraData
                    };

                return instance;
            });

        return res;
    }catch(err){
        console.log ('ERROR: ', err)
        return false;
    }

}

async function updateInstance(instanceID, data) {
    
    try {

        await axios({
            method: 'put',
            url: `${serverUrl}/api/updateInstance/${instanceID}`,
            data: {
                templateID: data.templateID,
                role: data.role,
                context: data.context,
                states: data.states,
                extraData: data.extraData
            }
        });
        
        //return true if successfully updated
        return true;
    }catch(err){
        console.log ('ERROR: ', err)
        return false;
    }
}

async function getTemplate(templateID) {
    
    try{
        const res = await axios({
            method: 'get',
            url: `${serverUrl}/api/getTemplate/${templateID}`
        }).then(response =>{
                response = response.data.data;
                temp = response.machines

                return temp;
            });

        return res;
    }catch(err){
        console.log ('ERROR: ', err)
        return false;
    }

}

/**
 * Set up roles array and set user role. Set default states of active machines.
 */
async function start() {    
    // TODO: have to enter "user" for state machine to init for testing REST API.

    //run mongo db server
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use(bodyParser.json())

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.use('/api', dbRouter)

    app.listen(apiPort, () => console.log(`Mongo server running on port ${apiPort}`))

    await new Promise(r => setTimeout(r, 500));
}

/**
 * Main function.
 */
async function main() {

    //set up all needed global variables and arrays
    await start();
    let input;

    cli: while (true) {
        input = await getInput("Type 'exit' to exit program\n");

        switch (input) {
            case "exit":
                break cli;
            default:
                console.log("Invalid input");
        }
    }

    //exit program when 'exit' is chosen
    process.exit(0);
}

const { isNull } = require("util");

// Create an express server.
const { response } = require("express");
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// Express routes
const router = express.Router();

// Create instance
// TODO: create instance should just have the context id and role id (for now). the others will need instance id and role id
server.use(
    "/",
    router.get("/createInstance/:cid/:rid/:lang", async (req, res) => {
        //context id
        let cid = req.params.cid;
        //role id
        let rid = req.params.rid;
        //language
        let lang = req.params.lang;
        console.log(`
        
Called createInstance with:
context=${cid}
role=${rid}

`);
        //get context
        let context = await getContext(cid);
        tid = context.templateID;
        context = context.languages;
        //get template from database
        await setAllTemplateDefaults(tid);

        //create instance and store instance id
        let instanceID = await createInstance(tid, rid, states[tid], cid);
        
        //get current state
        let currentState = states[tid][0].currentState;
        //get display data for current state
        let display = template[0].states[currentState].role[rid].display;

        let displayData = [];
        for (const obj of display.displayData) {
            for (const key in obj) {
                let val = obj[key];
                let o = {};
                o[key] = context[lang][key][val];
                displayData.push(o);
            }
        }

        console.log("Display=", displayData)

        return res.json({status: "success", currentState: currentState, displayObject: displayData, instanceID: instanceID});
    })
);

// Action call
server.use(
    "/",
    router.get("/callAction/:iid/:mid/:aid/:rid/:lang", async (req, res) => {
        console.log('REQ ', req.body)
        //instance id
        let instanceID = req.params.iid;
        //machine id
        let mid = req.params.mid;
        //action id
        let aid = req.params.aid;
        //language
        let lang = req.params.lang;
        //data
        let data = {};
        if(req.body.data){
            data = req.body.data;
        }

        //get instance
        let instance = await getInstance(instanceID);
        //role id
        let rid = instance.role;
        if (req.params.rid != rid){
            return res.status(401).json({
                message: "UNAUTHORIZED ACCESS"
            })
        }
        //template id
        let tid = instance.templateID;
        template = await getTemplate(tid);
        //instance states
        let instanceStates = instance.states;
        //set current states object to instance's states object
        states[tid] = instanceStates;

        console.log(`
        
Called callAction with:
role= ${rid}
template= ${tid}
machine= ${mid}
action= ${aid}

States= ${JSON.stringify(instanceStates)}

`);

        try {
            cid = instance.context;
            let context = await getContext(cid);
            
            let currentState = states[tid][mid].currentState;
            //add instance id to the data
            data.instanceID = instanceID;
            let response = await doAction(aid, mid, "user", rid, tid, data);
            console.log('response ', response)
            //after doing action, update instance object in case of any changes
            instance = await getInstance(instanceID);
            currentState = states[tid][mid].currentState;
            //replace old instance states with new states
            instance.states = states[tid];

            let updatedInstance = await updateInstance(instanceID, instance)
            if(updatedInstance){
                //get display data for new state
                let display = template[mid].states[currentState].role[rid].display;
    
                let displayData = [];
                for (const obj of display.displayData) {
                    for (const key in obj) {
                        let val = obj[key];
                        let o = {};
                        o[key] = context.languages[lang][key][val];
                        displayData.push(o);
                    }
                }
                // console.log(' response ', {status: "success", currentState: currentState, displayObject: displayData, data: response.data})
                return res.json({status: "success", currentState: currentState, displayObject: displayData, data: response.data});
            }else {
                return res.json({status: "fail"})
            }
        } catch (e) {
            return res.status(400).json({
                message: e,
                states: instanceStates,
            });
        }
    })
);

// User status
server.use(
    "/",
    router.get("/currentUserStatus/:iid/:mid/:rid/:lang", async (req , res) => {
        //instance id
        let instanceID = req.params.iid;
        //machine id
        let mid = req.params.mid;
        //language
        let lang = req.params.lang;
      
        //get instance
        let instance = await getInstance(instanceID);
        //role id
        let rid = instance.role;
        if (req.params.rid != rid){
            return res.status(401).json({
                message: "UNAUTHORIZED ACCESS"
            })
        }
        //template id
        let tid = instance.templateID;
        template = await getTemplate(tid);
        //instance states
        let instanceStates = instance.states;
        //set current states object to instance's states object
        states[tid] = instanceStates;

        console.log(`
        
Called currentUserStatus with:
role=${rid}
template=${tid}
machine=${mid}

States= ${JSON.stringify(instanceStates)}

`);
        cid = instance.context;
        let context = await getContext(cid);

        //get current state
        let currentState = states[tid][mid].currentState;
        //get display data for current state
        let display = template[mid].states[currentState].role[rid].display;

        let displayData = [];
        for (const obj of display.displayData) {
            for (const key in obj) {
                let val = obj[key];
                let o = {};
                o[key] = context.languages[lang][key][val];
                displayData.push(o);
            }
        }
        console.log("Display=", displayData)

        return res.json({status: "success", currentState: currentState, displayObject: displayData});
    })
);

// Run server
const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Express running on port: ${port}`);

//start program
main();

//export objects
exports.getRole = () => role;
exports.getStates = () => states;
exports.setStates = s => {states = s};
exports.getAllDisplayNames = () => allDisplayNames;
exports.setAllDisplayNames = d => {allDisplayNames = d};
exports.getAllUsers = () => allUsers;
exports.getTemplateID = () => templateID;
exports.getTemplate = () => template;
exports.setTemplate = setTemplate;
exports.doAction = doAction;