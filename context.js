const context = {
    newTemp: {
        "en-CA": {
            title: {
                1: {text: "Main Menu"},
                2: {text: "Change State"}
            },
            header: {
                1: {text: "Header"}
            },
            text: {
                1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
                2: `All templates and states`
            },
            button: {
                1: {text: "submit", actionID: 111},
                2: {text: "vote", actionID: 222}
            },
            image: {
                1: {
                    "alt-text": "cute cat picture",
                    "src": "https://www.sustainableplaces.eu/wp-content/uploads/2017/02/SmartBuilding.jpg"
                }
            }
        },
        "fr-CA": {
            title: {
                1: {text: "Menu principal"},
                2: {text: "Changer d'état"}
            },
            header: {
                1: {text: "Entête"}
            },
            text: {
                1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
            },
            button: {
                1: {text: "ok", actionID: 111},
                2: {text: "vote", actionID: 222}
            },
            image: {
                1: {
                    "alt-text": "photo de chat mignon",
                    "src": "https://www.sustainableplaces.eu/wp-content/uploads/2017/02/SmartBuilding.jpg"
                }
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