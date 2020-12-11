/**
 * Check if machine is active.
 * @param {string} machineName machine to check
 * @param {string} tid         template ID, set to templateID global variable by default
 * @returns {boolean} true if machine is active
 */
async function isActiveMachine(machineName, tid = templateID) {
    //set current template
    setTemplate(tid);
    //if root machine, return true
    if (machineName == "/") {
        return true;
    } else {
        let parentName = template[machineName].parent;
        let parent = states[templateID][parentName];
        let state;
        //set name of state
        if (parentName == "/") {
            state = machineName.substring(parentName.length);
        } else {
            state = machineName.substring(parentName.length + 1);
        }
        //if the parent is concurrent, call function recursively until you find if the state is active
        if (parent.concurrent) {
            return await isActiveMachine(parentName);
            //check if machine is active
        } else {
            return parent.currentState == state;
        }
    }
}

/**
 * Builds state path
 * @param {string} machineName  name of machine
 * @param {string} stateName    name of state
 * @returns {string} state path using parameters
 */
function buildStatePath(machineName, stateName) {
    if (machineName == "/") {
        return `${machineName}${stateName}`;
    } else {
        return `${machineName}/${stateName}`;
    }
}

/**
 * Prints all states in all templates.
 * @returns {Object} information about the request as well as all templates state data
 */
function showAllTemplatesAndStates() {
    let s = JSON.stringify(states, null, 2);
    console.log("All states \n", s);
    return {
        status: "success",
        type: "request",
        message: "All states returned successfully",
        data: s,
        // display: [
        //     {text: context[templateID].text[2]},
        //     {data: s}
        // ]
    };
}

/**
 * Check if properties exist in object.
 * @param {object} object        object to look for properties in
 * @param {string} properties    property to check in object
 * @returns {boolean} true if property not found
 */
function isUndefined(object, properties) {
    let allProps = properties.split(".");
    let temp = object;
    //check that each property exists in the object
    for (let i in allProps) {
        //
        if (typeof temp[allProps[i]] === "undefined") {
            return true;
        }
        temp = temp[allProps[i]];
    }
    return false;
}