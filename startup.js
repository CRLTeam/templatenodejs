const fs = require("fs");
// const { getAllTemplates, getTemplateID, getTemplate, getStates, getAllDisplayNames } = require('./renderer.js');
const render = require('./renderer.js')

let template;
let templateID;
let states;
let allDisplayNames;
let allTemplates;

function setVariables() {
    templateID = render.getTemplateID();
    template = render.getTemplate();
    states = render.getStates();
    allDisplayNames = render.getAllDisplayNames();
    allTemplates = render.getAllTemplates();
}

function updateVariables() {
    render.setAllDisplayNames(allDisplayNames);
    render.setStates(states);
}

/**
 * Sets local roles array from template.
 * @param {string}  tid     template ID
 * @return {Array}   array containing all roles from template
 */
function setRoles(tid) {
    render.setTemplate(tid);
    //create array to hold all roles from the template
    let arr = [];
    //loop through the roles in the template and push to array
        for (var r in allTemplates[templateID].roles) {
        if (allTemplates[templateID].roles.hasOwnProperty(r)) {
            arr.push(r);
        }
    }
    return arr;
}

/**
 * Goes through each template and sets up states context object
 */
async function setAllTemplatesDefaults() {
    setVariables();
    for (let tid in allTemplates) {
        //create object for template in allDisplayNames object
        allDisplayNames[tid] = {};
        //call setDefaults for the template
        await setDefaults(0, true, null, tid);
    }
}

/**
 * Called at startup to sets all defaults of active machines.
 * @param {string}   uid        uid of current state
 * @param {boolean}  active     if machine is active or not
 * @param {string}   stateUID   machine's stateUID in parent
 * @param {string}   tid        template ID, set to templateID global variable by default
 */
//function called at startup that sets all defaults of active machines
function setDefaults(uid, active, stateUID, tid) {  
    // render.setTemplate(tid)
    states[tid][uid] = {};
    //set concurrent true or false in states object
    states[tid][uid].concurrent = template[uid].concurrent;
    //set display name, make local variable for easier reference
    let dn = (states[tid][uid].displayName = template[uid].displayName);
    //set machine name for every machine
    allDisplayNames[tid][dn] = uid;

    //if machine is concurrent, current state is set to false
    if (states[tid][uid].concurrent) {
        states[tid][uid].currentState = false;
    //if default state is null, set current state to false
    } else if (template[uid].default == null) {
        states[tid][uid].currentState = null;
    //check if root
    } else if (uid == 0) {
        //if root, set current state. Have to do this check separately to not get TypeError from unidentified parent
        states[tid][uid].currentState = template[uid].default;
    //check if parent exists
    } else if (template[uid].parent !== null) {
        //if machine not active, set current state to null
        if (!active) {
            states[tid][uid].currentState = null;
        //if default state of parent is child, or parent contains concurrent machines, set child default as current state
        } else if (template[template[uid].parent].default == stateUID || template[template[uid].parent].default == null) {
            states[tid][uid].currentState = template[uid].default;
        }
    }

    //if history needed, save history obj
    if (template[uid].history) {
        states[tid][uid].history = "";
    }

    //loop through the states of the current state
    for (var stateUID in template[uid].states) {
        let stateMachineUID = template[uid].states[stateUID].machine;
        //set display name for every state
        let name = template[uid].states[stateUID].displayName;
        allDisplayNames[tid][name] = stateUID;

        //root machine is special case because it has no parent machine
        if (uid == 0) {
            //if the state is the default state of the machine, or if the machine is concurrent, the state will be active
            if (template[uid].default == stateUID || template[uid].concurrent) {
                //if so, set active variable to true
                active = true;
            } else {
                active = false;
            }
            //do same as above check, but this time check if the machine's parent is concurrent
        } else if (template[uid].default == stateUID || template[template[uid].parent].concurrent) {
            active = true;
        } else {
            active = false;
        }
        //if state is composite(machine), call setDefaults function for the state
        if (template[uid].states[stateUID].composite) {
            setDefaults(stateMachineUID, active, stateUID, tid);
            //if above conditions are not met, it is not a machine and no further action is needed, move on to next state
        } else {
        }
    }
    updateVariables();
    return;
}

module.exports = {
    setRoles: setRoles,
    setAllTemplatesDefaults: setAllTemplatesDefaults
}