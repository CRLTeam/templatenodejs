
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
const tester = require("./test-template.js");
const { setAllTemplatesDefaults, setRoles } = require('./startup.js');
const doFunction = require("./functions.js").doFunction;
const doTransition = require("./transitions.js").doTransition;
const doBroadcast = require("./transitions.js").doBroadcast;
const context = {}

let allTemplates = {};
let templateID;
let template;

//mongo server stuff

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 9001

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
function setTemplate(tid) {
    //uses inputted template id and sets it to the global variable templateID
    templateID = tid;
    //sets active template object to the one associated with the templateID
    // console.log('all temapltes ', allTemplates)
    console.log(' tempalte id ', templateID)
    template = allTemplates[templateID].machines;
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
function showAllStates(tid = templateID) {
    //set current template
    setTemplate(tid);
    let statesReturn = JSON.stringify(states[templateID], null, 2);
    console.log("All states \n", statesReturn);
    return {
        status: "success",
        type: "request",
        message: "States returned successfully",
        data: statesReturn
    };
}

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
function actionExists(action, machine, tid = templateID, role) {
    setTemplate(tid);
    let currState = states[tid][machine].currentState;
    console.log('curr state ', currState)
    console.log('role obj ', template[machine].states[currState].role)
    console.log('role var ', role)
    console.log('role ', template[machine].states[currState].role[role])
    
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
            let func = await doFunction(e.do, data);
            responseArr.push(func);
        } else if (e.type == "action") {
            //actions calling other actions will have special type 'eventCall'
            let act = doAction(e.do, machineName, "eventCall", role);
            responseArr.push(act);
        }
    }
    return responseArr;
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
        console.log('roile ', role)
        // role = role
        let response;
        templateID = tid;
        console.log('all temps ', allTemplates)
        // console.log('all temps template ', allTemplates[templateID])
        console.log('temaplte id ', templateID)
        console.log('machine name ', machineName)
        template = allTemplates[templateID];
        let machine = getMachine(machineName, templateID);
        if (machine == undefined) {
            reject(`Machine ${machineName} does not exist`);
            return;
        }

        // console.log(' 1111')
        //check if action exists
        if (!actionExists(actionName, machineName, templateID, role = role)) {
            reject(`Action "${actionName}" does not exist in the machine ${machineName}`);
            return;
        }
        // console.log(' 222222')
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
        // console.log(' 33333')

        //find first action that has condition that is met and execute it's events
        for (const event of events) {
            //if condition is true boolean, do event
            if (event.condition == 'true' || event.condition == true) {
                response = await doEvents(event.events, machineName, data);
                resolve(response);
                return;
            } else {
                //if not, check conditions
                for (const idx in event.condition) {
                    let funcArgs = {func: event.condition[idx].func,
                                    args: event.condition[idx].args}
                    let checkCon = await doFunction(funcArgs);
                    //console.log('check CONDITION??!@?!?@!?$!?$ ', checkCon)
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
function machineAvailableActions(machineName, tid, userRole = role) {
    //set template
    templateID = tid;
    template = allTemplates[templateID];
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
function getDisplayData(machineName, tid, state, userRole = role) {
    //set template 
    templateID = tid;
    template = allTemplates[templateID];

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

async function createInstance(tid, rid, states) {

    try{
        //create instance ID
        let instanceID = Math.floor(Math.random()*9999999);

        // TODO: create instances
        await axios({
            method: 'post',
            url: `${serverUrl}/api/addInstance`,
            data: {
                _id: instanceID,
                templateID: tid,
                role: rid,
                context: tid,
                states: JSON.stringify(states),
                data: '{}'
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
                    // context: response.context,
                    states: JSON.parse(response.states)
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
                // context: data.context,
                states: JSON.stringify(data.states)
            }
        });
        
        //return true if successfully updated
        return true;
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

    do {
        // Get user input to set template
        tid = await getInput("Please enter template ID: ");
        setTemplate(tid);
        //call function to set all default states for each template
        setAllTemplatesDefaults();
        setTemplate(tid);
        if(allTemplates[templateID]){
            template = allTemplates[templateID];
        }
    } while (templateID == -1);
    //ask user to set their role
    let roles = await setRoles(templateID);
    let userRole;
    
    while (true) {
        userRole = await getInput(`Please select a role [${roles}]: `);
        if (!roles.includes(userRole)) {
            console.log("Invalid input");
        } else {
            role = userRole;
            // if allUser object hasn't been created for this template yet, create it
            if(!allUsers[templateID]){
                allUsers[templateID] = {}
            }
            // if the role hasnt been added yet, add it
            if(!allUsers[templateID][role]){
                allUsers[templateID][role] = 0
            }
            allUsers[templateID][role]++;
            break;
        }
    }
}

/**
 * Main function.
 */
async function main() {
    let url = 'http://localhost:3001'
    // Set up allTemplates object

    // $.get(`${serverURL}/api/getAllData`, function(data, status){
    //     if(status == 'success'){

    //     }
    //     console.log('data is ???', data)
    //   })

    let fetched_templates
    try{
        await axios
            .get(`${url}/api/getAllData`)
            .then((res)=> { 
                fetched_templates = res.data.data
                // context = res.data.context
                // console.log('all templates ', allTemplates)
            })
    }catch(e){
        console.log('failed to fetch all data ', e);
    }

    for (let templ of fetched_templates) {
        // console.log('templ ', templ)
        // console.log('all temps ', allTemplates[templ])
        // for some reason one of the templates is empty at the end...
        // templ = allTemplates[templ]
        //create object for state
        states[templ._id] = {};

        // Add template to allTemplates
        allTemplates[templ._id] = templ.data;
        console.log(' context ', templ.extraData.context)
        // add context
        if(typeof templ.extraData.context == 'string'){
            templ.extraData.context = JSON.parse(templ.extraData.context)
        }
        context[templ._id] = templ.extraData.context
    }
    console.log('all temps ', allTemplates)
    console.log('states after main ', states)

    //set up all needed global variables and arrays
    await start();
    let input;

    cli: while (true) {
        input = await getInput("Choose option [all states,action,available actions,display data,exit]: ");
        let machineName;
        let displayState;

        switch (input) {
            case "all states":
                showAllStates();
                break;
            case "action":
                const inputted = await getInput(
                    "Please enter an action, followed by a space, then the machine name:\n"
                );
                let actionName = inputted.split(" ")[0];
                machineName = inputted.split(" ")[1];

                try {
                    let response = await doAction(actionName, machineName, "user", role, templateID);
                    console.log("response ", response);
                } catch (e) {
                    console.log(e);
                }

                break;
            case "available actions":
                machineName = await getInput("Please enter a machine name or 'all': ");
                if (machineName == "all") {
                    let allActions = await allAvailableActions(templateID);
                    console.log(allActions);
                } else {
                    let machineActions = await machineAvailableActions(machineName, templateID);
                    if (!machineActions) {
                        console.log(`Machine '${machineName}' does not exist`);
                    } else if (machineActions.length != 0) {
                        console.log(`Available actions in machine '${machineName}': ${machineActions}`);
                    } else {
                        console.log(`Machine '${machineName}' does not have any available actions`);
                    }
                }
                break;
            case "display data":
                machineName = await getInput("Please enter a machine name: ");
                displayState = await getInput("Please enter state name: ")
                let displayData = await getDisplayData(machineName, templateID, displayState);
                if (displayData == "") {
                    console.log(`Machine '${machineName}' does not exist`);
                }

                break;
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

//UNUSED CALLS
/** 
server.use(
    "/",
    router.get("/show_all_states/:tid", async (req, res) => {
        return res.json(states[req.params.tid]);
    })
);

server.use(
    "/",
    router.get("/all_available_actions/:tid", async (req, res) => {
        return res.json(allAvailableActions(req.params.tid));
    })
);

server.use("/machine_available_actions/:tid/:mid", async (req, res) => {
    const response = machineAvailableActions(req.params.mid, req.params.tid);
    if (response) {
        res.send(response);
    } else {
        res.statusCode(404);
    }
});

server.use(
    "/",
    router.post("/perform_action/:tid", async (req, res) => {
        const role = req.headers.role;
        const action = req.body.action;
        const machine = req.body.machine;

        try {
            await doAction(action, machine, "user", role, req.params.tid);

            return res.json({
                message: "Action run successfully!",
                states: states,
            });
        } catch (e) {
            return res.status(400).json({
                message: e,
                states: states,
            });
        }
    })
);
**/

// Express routes
// const router = express.Router();

// Create instance
server.use(
    "/",
    router.get("/createInstance/:tid/:rid/:lang", async (req, res) => {
        //template id
        let tid = req.params.tid;
        //role id
        let rid = req.params.rid;
        //language
        let lang = req.params.lang;
        console.log(`
        
Called createInstance with:
template=${tid}
role=${rid}

States= ${JSON.stringify(states[tid])}

`);
        setTemplate(tid);
        //call function to set all default states for each template
        await setAllTemplatesDefaults();
        setTemplate(tid);
        if(allTemplates[templateID]){
            template = allTemplates[templateID];
        }
        console.log('states are ', JSON.stringify(states[tid]))
        //create instance and store instance id
        let instanceID = await createInstance(tid, rid, states[tid]);
        console.log('instance id ', instanceID)
        
        //get current state
        let currentState = states[tid][0].currentState;
        //get display data for current state
        let display = allTemplates[tid]?.machines[0]?.states[currentState]?.role[rid]?.display;

        let displayData = [];
        for (const obj of display.displayData) {
            for (const key in obj) {
                let val = obj[key];
                let o = {};
                // console.log(' tid ', tid)
                // console.log(' key ', key)
                // console.log(' val ', val)
                // console.log(' context ', context)
                o[key] = context[tid][lang][key][val];
                displayData.push(o);
            }
        }

        console.log("Display=", displayData)

        return res.json({status: "success", currentState: currentState, displayObject: displayData, instanceID: instanceID, states:states[tid]});
    })
);

// Action call
server.use(
    "/",
    router.get("/callAction/:iid/:mid/:aid/:lang", async (req, res) => {
        //instance id
        let instanceID = req.params.iid;
        //machine id
        let mid = req.params.mid;
        //action id
        let aid = req.params.aid;
        //language
        let lang = req.params.lang;
        
        console.log('instanceid ', instanceID)
        //get instance
        let instance = await getInstance(instanceID);
        console.log('instance ', instance)
        //role id
        let rid = instance.role;
        //template id
        let tid = instance.templateID;
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
        // setTemplate(tid);
        // //call function to set all default states for each template
        // setAllTemplatesDefaults();
        // setTemplate(tid);
        // if(allTemplates[templateID]){
        //     template = allTemplates[templateID];
        // }
        try {
            let currentState = states[tid][mid].currentState;
            await doAction(aid, mid, "user", rid, tid);
            currentState = states[tid][mid].currentState;
            //replace old instance states with new states
            instance.states = states[tid];
            let updatedInstance = await updateInstance(instanceID, instance)
            if(updatedInstance){
                //get display data for new state
                let display = allTemplates[tid].machines[mid].states[currentState].role[rid].display;
    
                let displayData = [];
                for (const obj of display.displayData) {
                    for (const key in obj) {
                        let val = obj[key];
                        let o = {};
                        o[key] = context[tid][lang][key][val];
                        displayData.push(o);
                    }
                }
                return res.json({status: "success", currentState: currentState, displayObject: displayData});
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
    router.get("/currentUserStatus/:iid/:mid/:lang", async (req , res) => {
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
        //template id
        let tid = instance.templateID;
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

        //get current state
        let currentState = instanceStates[mid].currentState;
        //get display data for current state
        let display = allTemplates[tid].machines[mid].states[currentState].role[rid].display;

        let displayData = [];
        for (const obj of display.displayData) {
            for (const key in obj) {
                let val = obj[key];
                let o = {};
                o[key] = context[tid][lang][key][val];
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
exports.getAllTemplates = () => allTemplates;
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