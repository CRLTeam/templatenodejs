const fs = require("fs");

const render = require('./renderer.js')
const logFileName = "renderer-" + Date.now() + "-log.txt";

let template;
let templateID;
let states;
let allDisplayNames;
let role;

function setVariables() {
    templateID = render.getTemplateID();
    template = render.getTemplate();
    states = render.getStates();
    allDisplayNames = render.getAllDisplayNames();
    role = render.getRole();
}

function updateVariables() {
    render.setAllDisplayNames(allDisplayNames);
    render.setStates(states);
}

/**
 * Finds common ancestor of two states.
 * @param {string} from  from state
 * @param {string} to    to state
 * @returns {string[]}   index of common ancestor, from array, to array
 */
function findCommonAncestor(from, to) {
    let fromArr = [];
    let toArr = [];

    //make fromArr
    let currMachine = template[from.machine];
    fromArr.unshift(from.machine);
    while (true) {
        if (currMachine.parent == null) break;
        fromArr.unshift(currMachine.parent);
        if (currMachine.parent == 0) break;
        currMachine = template[currMachine.parent];
    }

    //make toArr
    currMachine = template[to.machine];
    toArr.unshift(to.machine);
    while (true) {
        if (currMachine.parent == null) break;
        toArr.unshift(currMachine.parent);
        if (currMachine.parent == 0) break;
        currMachine = template[currMachine.parent];
    }

    let i = 0;
    //loop through and find at what index common ancestor exists
    while (fromArr[i] == toArr[i] && i < fromArr.length && i < toArr.length) {
        i += 1;
    }

    return [i - 1, fromArr, toArr];
}

/**
 * Recursive function that exits machine from the last composite machine up
 * @param machineName name of machine
 */
async function exitNestedMachines(machineName) {
    console.log('states ', states)
    console.log('template id ', templateID)
    console.log('machine name ', machineName)
    console.log(' curr state ', states[templateID][machineName])
    let currState = states[templateID][machineName].currentState;
    let state;
    // if exiting concurrent state 
    if(currState == false){
        // exit every concurrent composite state
        for (const concurrState in template[machineName].states) {
            let state = template[machineName].states[concurrState];
            if([true,'true'].includes(state.composite)){
                let nextMachine = state.machine;
                await exitNestedMachines(nextMachine);
            }
        }
    // check if current state of machine is not composite(machine)
    } else if (![true,'true'].includes(template[machineName].states[currState].composite)) {
        state = template[machineName].states[currState];
        // if exit actions exist, call each exit action in order
        if (state.exit.length != 0) {
            for (action of state.exit) {
                try {
                    await doAction(action.action, machineName, "exit", role, templateID, action.args);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        // if machine has history, save currently active state to history
        if (template[machineName].history) {
            states[templateID][machineName].history = states[templateID][machineName].currentState;
        }
        //exit machine
        states[templateID][machineName].currentState = null;
        return;
        // current state is composite
    } else {
        state = template[machineName]["states"][currState];
        // set child machine uid
        let nextMachine = states[templateID][machineName].currentState;
        // recursively call function until you hit the bottom of the hierarchy (active machines)
        await exitNestedMachines(nextMachine);

        // if exit actions exist, call each exit action in order
        if (state.exit.length != 0) {
            for (action of state.exit) {
                try {
                    let res = await doAction(action.action, machineName, "exit", role, templateID, action.args);
                    exitRes.push(res);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        // if machine has history, save currently active state to history
        if (template[machineName].history) {
            states[templateID][machineName].history = states[templateID][machineName].currentState;
        }
        // exit machine
        states[templateID][machineName].currentState = null;

        return;
    }
}

let exitRes = [];
/**
 * Does exit action of state.
 * @param {string}  from        state being exited
 * @param {string}  stateUid    state uid
 * @param {string}  common      common ancestor
 * @returns {Array} array of exit action responses
 * TODO: add ability to erase history
 */
async function exit(from, stateUid, common) {
    let j = from.length - 1;
    exitRes = [];

    let machineName = from[j];
    let state = template[machineName].states[stateUid];
    //from first machine call function to keep checking for composite machines and exiting them first from the bottom of the hierarchy
    if ([true,'true'].includes(state.composite)) {
        let nextMachine = state.machine;
        await exitNestedMachines(nextMachine);
    // check if machine has concurrent states
    } else if([true,'true'].includes(template[machineName].concurrent)){
        // exit every concurrent composite state
        for (const concurrState in template[machineName].states) {
            let state = template[machineName].states[concurrState];
            if([true,'true'].includes(state.composite)){
                let nextMachine = state.machine;
                await exitNestedMachines(nextMachine);
            }
        }
    }
    //j--

    //go up the hierarchy from the "from" state and trigger each exit action
    while (j > common) {
        machineName = from[j];
        let currState = template[machineName].default;
        state = template[machineName].states[currState];

        //if exit actions exist, call each exit action in order
        if (state.exit.length != 0) {
            for (action of state.exit) {
                try {
                    let res = await doAction(action.action, machineName, "exit", role, templateID, action.args);
                    exitRes.push(res);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        //if machine has history, save currently active state to history
        if (template[machineName].history && j != common + 1) {
            states[templateID][machineName].history = states[templateID][machineName].currentState;
        }
        //exit machine
        console.log(`exiting ${machineName}....`);
        states[templateID][machineName].currentState = null;

        j--;
    }
    if (exitRes.length == 0) {
        return "No exit actions";
    }
    return exitRes;
}

/**
 * Recursive function that enters machine from the last composite machine up
 * @param machineName name of machine
 * @param concurr     true if machine is cconcurrent
 */
async function enterNestedMachines(machineName, concurr = false) {
    let machine = states[templateID][machineName];
    //if machine is concurrent, enter each concurrent state/machine
    if ([true,'true'].includes(machine.concurrent)) {
        for (let key in template[machineName].states) {
            await enterNestedMachines(template[machineName].states[key].machine, true);
        }
        return;
    }

    let state;
    //check if history is stored in machine
    if (template[machineName].history) {
        //if no previous history stored, enter machine default state
        if (machine.history == "") {
            machine.currentState = template[machineName].default;
            //if history was already stored, enter state stored in history, erase history
        } else {
            machine.currentState = machine.history;
            machine.history = "";
        }
        //if no history, simply enter default state
    } else {
        machine.currentState = template[machineName].default;
    }
    let currState = machine.currentState;

    //if machine is concurrent, set state to machine's default state
    if (concurr) {
        state = null;
    //if not, just set to current state
    } else {
        state = template[machineName].states[currState];
    }
    //if enter actions exist, call each enter action in order
    if (state){
        if (state.entry.length != 0) {
            for (action of state.entry) {
                try {
                    let res = await doAction(action.action, machineName, "entry", role, templateID, action.args);
                    enterRes.push(res);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    //have to check if there are any nested composite machines, if there are, keep digging
    //down and setting their default states until you hit hit the end of the chain
    let nextState = machine.currentState;
    let nextMachine = template[machine.currentState];
    if (nextMachine != undefined) {
        await enterNestedMachines(nextState);
    }
    return;
}

let enterRes = [];
/**
 * Does enter action of state.
 * @param {string}  to          state being entered
 * @param {string}  stateUid    state uid
 * @param {string}  common      common ancestor
 */
async function enter(to, stateUid, common) {
    let j = common;
    enterRes = [];
    //go down the hierarchy to target "to" state and trigger each enter action
    while (j <= to.length - 1) {
        let machineName = to[j];
        let state = template[machineName].states[stateUid];
        //check if history is stored in machine
        if (template[machineName].history) {
            //if no previous history stored, enter machine default state
            if (states[templateID][machineName].history == "") {
                console.log(`entering ${machineName}....`);
                states[templateID][machineName].currentState = stateUid;
            //if history was already stored, enter state stored in history, erase history
            } else {
                states[templateID][machineName].currentState = states[templateID][machineName].history;
                states[templateID][machineName].history = "";
            }
        } else {
            console.log(`entering ${machineName}....`);
            states[templateID][machineName].currentState = stateUid;
        }
        //if enter actions exist, call each enter action in order
        if(state.entry){
            if (state.entry.length != 0) {
                for (action of state.entry) {
                    try {
                        let res = await doAction(action.action, machineName, "entry", role, templateID, action.args);
                        enterRes.push(res);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        //if on last machine and it is composite, enter next machine's default state
        if ([true,'true'].includes(state.composite) && j == to.length - 1) {
            nextMachine = state.machine;
            await enterNestedMachines(nextMachine);
        }

        j++;
    }
    if (enterRes.length == 0) {
        return "No enter actions";
    }
    return enterRes;
}

/**
 * Performs state transition.
 * @param {string} machineName      machine name
 * @param {string} transitionName   transition name
 * @returns {Object} object containing transition data
 */
async function doTransition(machineName, transitionName) {
    setVariables();

    let machine = template[machineName];
    let currState = states[templateID][machineName].currentState;
    let transition = machine.states[currState].transitions[transitionName];

    //set to and from machine names
    let from = transition["from"];
    let to = transition["to"];
    //if to or from are undefined, this means they are simply states, composite states (machines)
    //in the case of just a state, to and from will be the path to the state from its parent machine

    //POTENTIAL ISSUE: removed await from exit and enter, could cause issues later?
    //call function to find and return common ancestor for the to and from states
    let [common, fromArr, toArr] = findCommonAncestor(from, to);
    //call exit function to perform exit actions
    let exitResponse = await exit(fromArr, from.uid, common);
    //call enter function to perform enter actions
    let enterResponse = await enter(toArr, to.uid, common);

    updateVariables();
    return {
        status: "success",
        type: "transition",
        message: `Transition from '${JSON.stringify(transition["from"])}' to '${JSON.stringify(transition["to"])}' complete`,
        data: {
            transitionFrom: JSON.stringify(transition["from"]),
            transitionTo: JSON.stringify(transition["to"]),
            exits: exitResponse,
            enters: enterResponse,
        }
    };
}

/**
 * Performs broadcast action.
 * @param {Object} broadcast broadcast machine and action uids
 * @returns {Object} object containing broadcast data
 */
async function doBroadcast(broadcast) {
    setVariables();
    try {
        //call action from other machine
        let res = await render.doAction(broadcast.action, broadcast.machine, "broadcast", role);

        updateVariables();
        return {
            status: "success",
            type: "broadcast",
            data: res
        };
    } catch (e) {
        return {
            status: "fail",
            type: "broadcast",
            message: "Broadcast failed",
            data: { error: e }
        };
    }
}

exports.doBroadcast = doBroadcast;
exports.doTransition = doTransition;