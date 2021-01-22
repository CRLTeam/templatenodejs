const context = {
    newTemp: {
        "en-CA": {
            title: {
                1: {text: "oh hi"},
                2: {text: "oh bye"},
                3: {text: "hehe"}
            },
            text: {
                //defaults
                1: `All states`,
                2: `All templates and states`,
                3: `Transition successful`,
                4: `Broadcast successful`,
                5: `Broadcast failed`,
                6: `Data successfully added to template`,
                7: `Item does NOT exist in the template`,
                8: `Requested data retrieved`,
                //user defined
                
            },
            button: {
                1: {text: "ok", actionID: 111},
                2: {text: "vote", actionID: 222}
            }
        },
        "fr-CA": {
            text: {
                //defaults
                1: `quoi`,
                2: `All templates and states`,
                3: `Transition successful`,
                4: `Broadcast successful`,
                5: `Broadcast failed`,
                6: `Data successfully added to template`,
                7: `Item does NOT exist in the template`,
                8: `Requested data retrieved`,
                //user defined
                
            },
            button: {
                1: "ok",
                2: "vote"
            }
        }
    },
    lights: {
        "en-CA": {
            text: {
                //defaults
                1: `All states`,
                2: `All templates and states`,
                3: `Transition successful`,
                4: `Broadcast successful`,
                5: `Broadcast failed`,
                6: `Data successfully added to template`,
                7: `Item does NOT exist in the template`,
                8: `Requested data retrieved`,
                //user defined
                9: `Red Light`,
                10: `Green Light`,
                11: `Yellow Light`
            },
            button: {
                1: "ok",
                2: {text: "Change to Green", action: "action-59e570"},
                3: {text: "Change to Yellow", action: "action-59e570"},
                4: {text: "Change to Red", action: "action-59e570"},
            }
        }
    }
}

exports.context = context;