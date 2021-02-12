const context = {
    displayer: {
        "en-CA": {
            menu: {
                1: {
                    options: [
                    {
                        "1": {
                        "text": "image",
                        "action": "action-xKdoWs"
                        },
                        "type": "regular"
                    },
                    {
                        "2": {
                        "text": "video",
                        "action": "action-YFnQ8Q"
                        },
                        "type": "regular"
                    },
                    {
                        "3": {
                        "text": "radio buttons",
                        "action": "action-qYrGjY"
                        },
                        "type": "regular"
                    },
                    {
                        "4": {
                        "text": "check boxes",
                        "action": "action-d1I57x"
                        },
                        "type": "regular"
                    },
                    {
                        "5": {
                        "text": "dropdown",
                        "action": "action-Xk0kWS"
                        },
                        "type": "regular"
                    },
                    {
                        "6": {
                        "text": "text inputs",
                        "action": "action-rdGbbT"
                        },
                        "type": "regular"
                    },
                    {
                        "7": {
                        "text": "date and time inputs",
                        "action": "action-gs2tio"
                        },
                        "type": "regular"
                    }
                    ]
                }
            },
            title: {
                0: {text: "Main Menu"},
                1: {text: "Image"},
                2: {text: "Video"},
                3: {text: "Radio Buttons"},
                4: {text: "Check Boxes"},
                5: {text: "Dropdown"},
                6: {text: "Text Inputs"},
                7: {text: "Date and Time"},
            },
            header: {
                1: {text: "Header"}
            },
            text: {
                1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
                2: `All templates and states`
            },
            button: {
                1: {text: "Return to Main Menu", actionID: "action-7a9cf8"}
            },
            image: {
                1: {
                    "alt-text": "cute cat picture",
                    "src": "https://www.sustainableplaces.eu/wp-content/uploads/2017/02/SmartBuilding.jpg"
                }
            },
            video: {
                1: {
                    "alt-text": "nature video",
                    "src": "https://www.youtube.com/watch?v=RK1K2bCg4J8"
                }
            },
            radioButtonList: {
                1: {
                    defaultSelected: true,
                    options: [
                        {
                            radioButton: {
                                text: "option one",
                                isDefault: true
                            }
                        },
                        {
                            radioButton: {
                                text: "option two",
                                isDefault: false
                            }
                        }
                    ]
                }
            },
            checkBoxList: {
                1: {
                    minSelect: 1,
                    maxSelect: 2,
                    options: [
                        {
                            checkBox: {
                                text: "first option"
                            }
                        },
                        {
                            checkBox: {
                                text: "second option"
                            }
                        }
                    ]
                }
            },
            dropDownSelect: {
                1: {
                    defaultSelect: true,
                    options: [
                        {
                            option: {
                                text: "example one",
                                isDefault: true
                            }
                        },
                        {
                            option: {
                                text: "example two",
                                isDefault: false
                            }
                        }
                    ]
                }
            },
            shortTextInput: {
                1: {
                    inputName: "Type example short text input",
                    inputLength: 256 // num of char
                }
            },
            paragraphInput: {
                1: {
                    inputName: "Type example paragraph input",
                    inputLength: 256 // num of words
                }
            },
            dateInput: {
                1: {
                    inputName: "Please enter date" // "format": "mm/dd/yyyy"
                }              
            },
            timeInput: {
                1: {
                    inputName: "Please enter time" // "format": "12h/24h" // Based on user language/region
                }              
            }
        }
    },
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