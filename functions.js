const fs = require("fs");

const render = require('./renderer.js')
const logFileName = "renderer-" + Date.now() + "-log.txt";

let template;
let templateID;
let states;
//let allDisplayNames;

const axios = require('axios');
const serverUrl = 'http://localhost:3001';

// axios({
//     method: 'post',
//     url: `${url}/api/template`,
//     data: {
//       _id: tid,
//       data: "First entry"
//     }
// })

function setVariables() {
    templateID = render.getTemplateID();
    template = render.getTemplate();
    states = render.getStates();
    //allDisplayNames = render.getAllDisplayNames();
}

function updateVariables() {
    render.setAllDisplayNames(allDisplayNames);
    render.setStates(states);
}

/**
 * Calls function from action.
 * @param {Object} func      name of function
 * @param {Object} data     data
 */
async function doFunction(func, data, funcData) {
    setVariables();
    let response;
    let instanceID = data.instanceID;
    delete data.instanceID;

    // split arguments into variables for every function type
    if(func == 'setData'){
        response = await runFunction['setData'](instanceID, data, funcData);
        return response; 
    }else if(func == 'getData'){

        response = await runFunction['getData'](instanceID);
        response = response.extraData;

        let extraData = {};
        //get the funcdata extra data
        for (data of funcData){
            extraData[data] = response[data];
        }

        return extraData;
    }else if(func == 'sendEmail'){
        //console.log('DATA IN SENDEMAIL', data)
        let emails = data.emails;
        let message = data.message;
        response = await runFunction['sendEmail'](emails, message)
    }
    // else if(func == 'machineInState'){
    //     let argsArr = args.split(",");
    //     let checkMachine = argsArr[0].trim();
    //     let checkState = argsArr[1].trim();

    //     response = runFunction['machineInState'](templateID, checkMachine, checkState);
    //     return response;
    // }else if(func == 'incrementData'){
    //     let argsArr = args.split(",");
    //     let name = argsArr[0].trim();

    //     response = runFunction['incrementData'](templateID, name);
    //     return response;
    // }else if(func == 'decrementData'){
    //     let argsArr = args.split(",");
    //     let name = argsArr[0].trim();

    //     response = runFunction['decrementData'](templateID, name);
    //     return response;
    // }else if(func == 'roleCount'){
    //     let argsArr = args.split(",");
    //     let checkRole = argsArr[0].trim();
    //     let comparisonType;
    //     let operator = argsArr[1].trim();
    //     let comparator = argsArr[2].trim();

    //     if(isNaN(comparator)){
    //         comparisonType = "data";
    //     }else{
    //         comparisonType = "number";
    //     }

    //     response = runFunction['roleCount'](templateID, checkRole, comparisonType, operator, comparator);
    //     return response;
    // }else if(func == 'percentOfData'){
    //     let argsArr = args.split(",");
    //     let comparand = argsArr[0].trim();
    //     let percentage = argsArr[1].trim();
    //     let operator = argsArr[2].trim();
    //     let comparator = argsArr[3].trim();
    //     let comparisonType;

    //     if(isNaN(comparator)){
    //         comparisonType = "data";
    //     }else{
    //         comparisonType = "number";
    //     }

    //     response = runFunction['percentOfData'](templateID, comparand, percentage, operator, comparator);
    //     return response;
    // }else if(func == 'compareData'){
    //     let argsArr = args.split(",");
    //     let comparand = argsArr[0].trim();
    //     let operator = argsArr[1].trim();
    //     let comparator = argsArr[2].trim();

    //     response = runFunction['compareData'](templateID, comparand, operator, comparator);
    //     return response;
    // }else if(func == 'evaluateData'){
    //     let argsArr = args.split(",");
    //     let data = argsArr[0].trim();
    //     let operator = argsArr[1].trim();
    //     let comparator = argsArr[2].trim();

    //     response = runFunction['evaluateData'](templateID, data, operator, comparator);
    //     return response;
    // }
    // else if(func == 'vote'){
    //     let argsArr = args.split(",");
    //     let 

    //     //return response = runFunction['evaluateData'](templateID, )
    // }
}

//temporary data storage
let allData = {
    "111": {},
    "222": {},
    "1": {},
    "funcTest": {},
    "andrew": {}
};

//function object that contains all the functions that the user can call from actions
let runFunction = {
    /**
     * Will store data in the database.
     * @param {string} instance   instance ID
     * @param {Object} data  data
     * @param {string} name  name of property in the context database
     * @param {Object} info  data to be stored
     * @returns {Object}     information about the request and newly stored data
     */
    setData: async function (instanceID, data, funcData) {

        const resp = await runFunction['getData'](instanceID);
        let extra = resp.extraData
            
        // go through funcData and add all the data values that have key from funcData 
        for (element of funcData) {
            extra[element] = data[element]
        }

        let res = await axios({
            method: 'put',
            url: `${serverUrl}/api/updateInstance/${instanceID}`,
            data: {
                templateID: resp.templateID,
                role: resp.role,
                context: resp.context,
                states: resp.states,
                extraData: extra
            }
        });

        return res.status;

    },

    /**
     * Will get data from the database.
     * @param {string} tid   template ID
     * @param {string} name  name of property in the context database
     * @returns {Object}     information about the request and requested data
     */
    getData: async function (instanceID) {

        const resp = await axios({
            method: 'get',
            url: `${serverUrl}/api/getInstance/${instanceID}`
        }).then(response =>{
                return response.data.data;
            });
        return resp
    },

    /**
     * Send email
     * @param   {Array}   emails    list of recipient email addresses
     * @param   {string}  message   email message
     * @returns {Object}            information about the request and requested data
     */
     sendEmail: async function (emails, message) {

        console.log('emails', emails[0])
        console.log('meSSAGE', message)
        let emailMsg = `

`

        const options = {
            method: 'POST',
            url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
            headers: {
            'content-type': 'application/json',
            'x-rapidapi-key': '8a3062cd37msh8bba38cd45cedcap12feb0jsnf12fecc48bb2',
            'x-rapidapi-host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
            },
            data: {
            personalizations: [{to: [{email: `${emails[0]}`}], subject: 'Hello, World!'}],
            from: {email: 'from_address@example.com'},
            content: [{type: 'text/plain', value: 'Hello, World!'}]
            }
        };
        
        await axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });

        // const resp = await axios({
        //     method: 'get',
        //     url: `${serverUrl}/api/getInstance/${instanceID}`
        // }).then(response =>{
        //         return response.data.data;
        //     });
        // return resp
    },

    /**
     * Will increment data
     * @param {string} tid   template ID
     * @param {string} name  name of property in the context database
     * @returns {Object}     information about the request and newly stored data
     */
    incrementData: function (tid, name) {
        if(!allData[tid][name]){
            allData[tid][name] = 1;
        }else{
            allData[tid][name] += 1;
        }

        return {
            status: "success",
            type: "increment data",
            message: `Data successfully incremented`,
            data: allData[tid][name],
            // display: [
            //     {text: context[templateID].text[6]},
            //     {button: context[templateID].button[1]}
            // ]
        };
    },

    /**
     * Will decrement data
     * @param {string} tid   template ID
     * @param {Object} data  data
     * @param {string} name  name of property in the context database
     * @param {Object} info  data to be stored
     * @returns {Object}     information about the request and newly stored data
     */
    decrementData: function (tid, name) {
        if(!allData[tid][name]){
            return {
                status: "fail",
                type: "decrement data",
                message: `Failed to decremented data, data object does not exist`
                // display: [
                //     {text: context[templateID].text[6]},
                //     {button: context[templateID].button[1]}
                // ]
            };
        }else{
            allData[tid][name] -= 1;
        }

        return {
            status: "success",
            type: "decrement data",
            message: `Data successfully decremented`,
            data: allData[tid][name],
            // display: [
            //     {text: context[templateID].text[6]},
            //     {button: context[templateID].button[1]}
            // ]
        };
    },

    /**
     * Checks if machine is in certain state
     * @param {string} tid            template ID
     * @param {string} checmMachine   machine to check
     * @param {string} checkState     state to check
     * @returns {boolean}               true if machine is in the state
     */
    machineInState: function (tid, checkMachine, checkState) {
        return states[tid][checkMachine].currentState == checkState ? true : false;
    },

    /**
     * Checks and compares role user amount
     * @param {string} tid              template ID
     * @param {string} checkRole        role being checked
     * @param {string} comparisonType   type of comparison (eg. number or variable)
     * @param {string} operator         operator to use in comparison
     * @param {string} comparator       item to be compared to
     * @returns {boolean}               true if comparison evaluates to true
     */
    roleCount: function (tid, checkRole, comparisonType, operator, comparator) {
        // console.log('all users/////////', allUsers)
        // console.log('check role ', checkRole)
        // console.log('comparison type ', comparisonType)
        // console.log('operator', operator)
        // console.log('comparator ', comparator)
        // console.log('all user check? ', allUsers[tid][checkRole])
        // console.log('supposed to be? ', (allUsers[tid][checkRole] > comparator ? true : false))
        if(comparisonType == 'data'){
            allUsers[tid][checkRole]
            if(operator == '<'){
                return allUsers[tid][checkRole] < runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '>'){
                return allUsers[tid][checkRole] > runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '>='){
                return allUsers[tid][checkRole] >= runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '<='){
                return allUsers[tid][checkRole] <= runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '=='){
                return allUsers[tid][checkRole] == runFunction['getData'](tid, comparator) ? true : false;
            }
        }else if(comparisonType == 'number'){
            if(operator == '<'){
                return allUsers[tid][checkRole] < comparator ? true : false;
            }else if (operator == '>'){
                return (allUsers[tid][checkRole] > comparator ? true : false);
            }else if (operator == '>='){
                return allUsers[tid][checkRole] >= comparator ? true : false;
            }else if (operator == '<='){
                return allUsers[tid][checkRole] <= comparator ? true : false;
            }else if (operator == '=='){
                return (allUsers[tid][checkRole] == comparator ? true : false);
            }
        }
        return states[tid][machine].currentState == state ? true : false;
    },

    /**
     * Compare data percent to number
     * @param {string} tid              template ID
     * @param {string} comperand        first item to compare
     * @param {number} percentage       percent that is needed
     * @param {string} operator         operator to use in comparison
     * @param {string} comparator       item to be compared to
     * @returns {boolean}               true if comparison evaluates to true
     */
    percentOfData: function (tid, comparand, percentage, operator, comparator, comparisonType) {
        let percent = (percentage/100);

        if(comparisonType == 'data'){
            if(operator == '<'){
                return comparand*percent < runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '>'){
                return comparand*percent > runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '>='){
                return comparand*percent >= runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '<='){
                return comparand*percent <= runFunction['getData'](tid, comparator) ? true : false;
            }else if (operator == '=='){
                return comparand*percent == runFunction['getData'](tid, comparator) ? true : false;
            }
        }else if(comparisonType == 'number'){
            if(operator == '<'){
                return comparand*percent < comparator ? true : false;
            }else if (operator == '>'){
                return comparand*percent > comparator ? true : false;
            }else if (operator == '>='){
                return comparand*percent >= comparator ? true : false;
            }else if (operator == '<='){
                return comparand*percent <= comparator ? true : false;
            }else if (operator == '=='){
                return comparand*percent == comparator ? true : false;
            }
        }
    },

    /**
     * Compare two data items
     * @param {string} tid              template ID
     * @param {string} comperand        first item to compare
     * @param {string} operator         operator to use in comparison
     * @param {string} comparator       item to be compared to
     * @returns {boolean}               true if comparison evaluates to true
     */
    compareData: function (tid, comparand, operator, comparator) {

        if(operator == '<'){
            return comparand < runFunction['getData'](tid, comparator) ? true : false;
        }else if (operator == '>'){
            return comparand > runFunction['getData'](tid, comparator) ? true : false;
        }else if (operator == '>='){
            return comparand >= runFunction['getData'](tid, comparator) ? true : false;
        }else if (operator == '<='){
            return comparand <= runFunction['getData'](tid, comparator) ? true : false;
        }else if (operator == '=='){
            return comparand == runFunction['getData'](tid, comparator) ? true : false;
        }
    },

    /**
     * Evaluate data
     * @param {string} tid              template ID
     * @param {string} data             item to compare
     * @param {string} operator         operator to use in comparison
     * @param {string} comparator       number to be compared to
     * @returns {boolean}               true if comparison evaluates to true
     */
    evaluateData: function (tid, data, operator, comparator) {
        
        if(operator == '<'){
            return comparand < comparator ? true : false;
        }else if (operator == '>'){
            return comparand > comparator ? true : false;
        }else if (operator == '>='){
            return comparand >= comparator ? true : false;
        }else if (operator == '<='){
            return comparand <= comparator ? true : false;
        }else if (operator == '=='){
            return comparand == comparator ? true : false;
        }
    },

    /**
     * Sets timer
     * @param {string} tid      template ID
     * @param {string} data     data
     * @param {string} time     time to set (in seconds)
     */
    setTimer: function (tid, data, time) {
        //make timer function
        setTimeout(() => {
            console.log(`Timer running, set for ${time} seconds`);
        }, time * 1000);
    },
};

exports.doFunction = doFunction;