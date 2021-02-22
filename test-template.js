
////////////////////////////////////////////
const pcc =   {
    "uid": "pcc",
    "roles": {
        "default-role": {
          "displayName": "Default role"
        }
      },
      "machines": {
        "0": {
            "displayName": "/",
            "parent": null,
            "default": "state-ff6d12",
            "concurrent": false,
            "history": false,
            "transitions": {},
            "actions": {},
            "states": {
                "state-ff6d12": {
                    "displayName": "pcc_selection",
                    "machine": "machine-1",
                    "composite": true,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "90e585": {
                            "displayName": "move to pcc agreement",
                            "from": {
                                "machine": "0",
                                "uid": "state-ff6d12"
                            },
                            "to": {
                                "machine": "0",
                                "uid": "state-c5df3d"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 1},
                                    {header: 1},
                                    {image: 1},
                                    {button: 1}
                                ]
                            },
                            "actions": {
                                "action-7a9cf8": {
                                "displayName": "choose desired pcc",
                                "action": [
                                    {
                                        "condition": true,
                                        "events": [
                                            {
                                                "type": "transition",
                                                "do": "90e585"
                                            }
                                        ]
                                    }
                                ]
                                }
                            }
                        }
                    }
                },
                "state-c5df3d": {
                    "displayName": "pcc_agreement",
                    "machine": "machine-2",
                    "composite": true,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "KWSjJp": {
                            "displayName": "back to pcc selection",
                            "from": {
                                "machine": "0",
                                "uid": "state-c5df3d"
                            },
                            "to": {
                                "machine": "0",
                                "uid": "state-ff6d12"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 2},
                                    {button: 2}
                                ]
                            },
                            "actions": {
                                "action-ujcJxV": {
                                    "displayName": "find different pcc",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "KWSjJp"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
            },
        },
        "machine-1": {
            "displayName": "/pcc_selection",
            "parent": "0",
            "default": "state-dd134h2",
            "concurrent": false,
            "history": true,
            "transitions": {},
            "actions": {},
            "states": {
                "state-dd134h2": {
                    "displayName": "preference_selection",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "29SjcW": {
                            "displayName": "update preferences",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-dd134h2"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 3},
                                    {button: 3}
                                ]
                            },
                            "actions": {
                                "action-MX91Uq": {
                                "displayName": "preferences selected",
                                "action": [
                                    {
                                        "condition": true,
                                        "events": [
                                            {
                                                "type": "transition",
                                                "do": "29SjcW"
                                            }
                                        ]
                                    }
                                ]
                                }
                            }
                        }
                    }
                },
                "state-j1452d3": {
                    "displayName": "agent_review",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "84ghd12": {
                            "displayName": "update choices",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-QSaIwW"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {text: 4},
                                    {button: 4}
                                ]
                            },
                            "actions": {
                                "action-XaPbEj": {
                                    "displayName": "switch",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "84ghd12"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                "state-QSaIwW": {
                    "displayName": "pcc_selection",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "4n79Bk": {
                            "displayName": "update preferences",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-QSaIwW"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {text: 4},
                                    {button: 4}
                                ]
                            },
                            "actions": {
                                "action-QtBzeH": {
                                    "displayName": "update preferences",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "4n79Bk"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "action-dIjcUj": {
                                    "displayName": "select pcc",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "broadcast",
                                                    "do": {
                                                      "machine": "machine-0",
                                                      "action": "action-7a9cf8"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
            },
        },
        "machine-2": {
            "displayName": "/pcc_agreement",
            "parent": "0",
            "default": "state-zRRRqY",
            "concurrent": false,
            "history": true,
            "transitions": {},
            "actions": {},
            "states": {
                "state-zRRRqY": {
                    "displayName": "review_terms",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "kgvAZG": {
                            "displayName": "send contract to lawyer",
                            "from": {
                                "machine": "machine-2",
                                "uid": "state-zRRRqY"
                            },
                            "to": {
                                "machine": "machine-2",
                                "uid": "state-j1452d3"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 3},
                                    {button: 3}
                                ]
                            },
                            "actions": {
                                "action-MX91Uq": {
                                "displayName": "send contract",
                                "action": [
                                    {
                                        "condition": true,
                                        "events": [
                                            {
                                                "type": "transition",
                                                "do": "kgvAZG"
                                            }
                                        ]
                                    }
                                ]
                                }
                            }
                        }
                    }
                },
                "state-j1452d3": {
                    "displayName": "lawyer_review",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "84ghd12": {
                          "displayName": "update terms",
                          "from": {
                              "machine": "machine-1",
                              "uid": "state-j1452d3"
                          },
                          "to": {
                              "machine": "machine-1",
                              "uid": "state-QSaIwW"
                          }
                        },
                        "84ghd12": {
                            "displayName": "update terms",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-QSaIwW"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {text: 4},
                                    {button: 4}
                                ]
                            },
                            "actions": {
                                "action-XaPbEj": {
                                    "displayName": "switch",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "84ghd12"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                "state-QSaIwW": {
                    "displayName": "pcc_selection",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "4n79Bk": {
                            "displayName": "update preferences",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-QSaIwW"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {text: 4},
                                    {button: 4}
                                ]
                            },
                            "actions": {
                                "action-QtBzeH": {
                                    "displayName": "update preferences",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "4n79Bk"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "action-dIjcUj": {
                                    "displayName": "select pcc",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "broadcast",
                                                    "do": {
                                                      "machine": "machine-0",
                                                      "action": "action-7a9cf8"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
            },
        },
      }
    }


////////////////////////////////////////////
const newTemp =   {
    "uid": "newTemp",
    "roles": {
        "default-role": {
          "displayName": "Default role"
        }
      },
      "machines": {
        "0": {
            "displayName": "/",
            "parent": null,
            "default": "state-ff6d12",
            "concurrent": false,
            "history": false,
            "transitions": {},
            "actions": {},
            "states": {
                "state-ff6d12": {
                    "displayName": "basic",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "90e585": {
                            "displayName": "switch",
                            "from": {
                                "machine": "0",
                                "uid": "state-ff6d12"
                            },
                            "to": {
                                "machine": "0",
                                "uid": "state-c5df3d"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 1},
                                    {header: 1},
                                    {image: 1},
                                    {button: 1}
                                ]
                            },
                            "actions": {
                                "action-7a9cf8": {
                                "displayName": "switch",
                                "action": [
                                    {
                                        "condition": true,
                                        "events": [
                                            {
                                                "type": "transition",
                                                "do": "90e585"
                                            }
                                        ]
                                    }
                                ]
                                }
                            }
                        }
                    }
                },
                "state-c5df3d": {
                    "displayName": "second",
                    "machine": "machine-1",
                    "composite": true,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "90e585": {
                            "displayName": "switch",
                            "from": {
                                "machine": "0",
                                "uid": "state-c5df3d"
                            },
                            "to": {
                                "machine": "0",
                                "uid": "state-ff6d12"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 2},
                                    {button: 2}
                                ]
                            },
                            "actions": {
                                "action-7a9cf8": {
                                    "displayName": "switch",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "90e585"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "action-5h12i8": {
                                    "displayName": "broadcast",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                "type": "broadcast",
                                                "do": {
                                                    "machine": "machine-1",
                                                    "action": "action-7a9cf8"
                                                }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
            },
        },
        "machine-1": {
            "displayName": "/first",
            "parent": "0",
            "default": "state-dd134h2",
            "concurrent": false,
            "history": false,
            "transitions": {},
            "actions": {},
            "states": {
                "state-dd134h2": {
                    "displayName": "basic",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "90e585": {
                            "displayName": "switch",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-dd134h2"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {title: 3},
                                    {button: 3}
                                ]
                            },
                            "actions": {
                                "action-7a9cf8": {
                                "displayName": "switch",
                                "action": [
                                    {
                                        "condition": true,
                                        "events": [
                                            {
                                                "type": "transition",
                                                "do": "90e585"
                                            }
                                        ]
                                    }
                                ]
                                }
                            }
                        }
                    }
                },
                "state-j1452d3": {
                    "displayName": "second",
                    "machine": null,
                    "composite": false,
                    "entry": [],
                    "exit": [],
                    "transitions": {
                        "84ghd12": {
                            "displayName": "switch",
                            "from": {
                                "machine": "machine-1",
                                "uid": "state-j1452d3"
                            },
                            "to": {
                                "machine": "machine-1",
                                "uid": "state-dd134h2"
                            }
                        }
                    },
                    "role": {
                        "default-role":{
                            "display": {
                                "description": "title",
                                "displayData": [
                                    {text: 4},
                                    {button: 4}
                                ]
                            },
                            "actions": {
                                "action-7a9cf8": {
                                    "displayName": "switch",
                                    "action": [
                                        {
                                            "condition": true,
                                            "events": [
                                                {
                                                    "type": "transition",
                                                    "do": "84ghd12"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
            },
        }
      }
    }

///////////////////// TODO: nothing, using as bookmark for displayer
    const displayer =   {
        "uid": "displayer",
        "roles": {
            "default-role": {
              "displayName": "Default role"
            }
          },
          "machines": {
            "0": {
                "displayName": "/",
                "parent": null,
                "default": "state-ff6d12",
                "concurrent": false,
                "history": false,
                "transitions": {},
                "actions": {},
                "states": {
                    "state-ff6d12": {
                        "displayName": "menu",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "90e585": {
                                "displayName": "image",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-c5df3d"
                                }
                            },
                            "aSFaCv": {
                                "displayName": "video",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-YS0rHZ"
                                }
                            },
                            "lnKxrX": {
                                "displayName": "radio",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-aRJkHJ"
                                }
                            },
                            "wKLr9q": {
                                "displayName": "checkbox",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-38o8Oz"
                                }
                            },
                            "wDMfP3": {
                                "displayName": "dropdown",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-goazMT"
                                }
                            },
                            "NLVpTG": {
                                "displayName": "textbox",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-xJsuJD"
                                }
                            },
                            "uQGi41": {
                                "displayName": "date&time",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-SyoYJT"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "title",
                                    "displayData": [
                                        {title: 0},
                                        {menu: 1}
                                    ]
                                },
                                "actions": {
                                    "action-xKdoWs": {
                                        "displayName": "image",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "90e585"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "action-YFnQ8Q": {
                                        "displayName": "video",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "aSFaCv"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "action-qYrGjY": {
                                        "displayName": "radio",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "lnKxrX"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "action-d1I57x": {
                                        "displayName": "checkbox",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "wKLr9q"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "action-Xk0kWS": {
                                        "displayName": "dropdown",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "wDMfP3"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "action-rdGbbT": {
                                        "displayName": "text",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "NLVpTG"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "action-gs2tio": {
                                        "displayName": "date&time",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "uQGi41"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-c5df3d": {
                        "displayName": "image",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "LPiqRQ": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-c5df3d"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "image",
                                    "displayData": [
                                        {title: 1},
                                        {image: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "LPiqRQ"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-YS0rHZ": {
                        "displayName": "video",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "r8WfZg": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-YS0rHZ"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "video",
                                    "displayData": [
                                        {title: 2},
                                        {video: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "r8WfZg"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-aRJkHJ": {
                        "displayName": "radio",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "1tICXi": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-aRJkHJ"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "radio",
                                    "displayData": [
                                        {title: 3},
                                        {radioButtonList: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "1tICXi"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-38o8Oz": {
                        "displayName": "checkbox",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "meAqCz": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-38o8Oz"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "checkbox",
                                    "displayData": [
                                        {title: 4},
                                        {checkBoxList: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "meAqCz"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-goazMT": {
                        "displayName": "dropdown",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "HPZQdy": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-goazMT"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "dropdown",
                                    "displayData": [
                                        {title: 5},
                                        {dropDownSelect: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "HPZQdy"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-xJsuJD": {
                        "displayName": "textbox",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "0rDb8M": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-xJsuJD"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "textbox",
                                    "displayData": [
                                        {title: 6},
                                        {shortTextInput: 1},
                                        {paragraphInput: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "0rDb8M"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "state-SyoYJT": {
                        "displayName": "date&time",
                        "machine": null,
                        "composite": false,
                        "entry": [],
                        "exit": [],
                        "transitions": {
                            "dqZBSS": {
                                "displayName": "menu",
                                "from": {
                                    "machine": "0",
                                    "uid": "state-SyoYJT"
                                },
                                "to": {
                                    "machine": "0",
                                    "uid": "state-ff6d12"
                                }
                            }
                        },
                        "role": {
                            "default-role":{
                                "display": {
                                    "description": "date and time",
                                    "displayData": [
                                        {title: 7},
                                        {dateInput: 1},
                                        {timeInput: 1},
                                        {button: 1}
                                    ]
                                },
                                "actions": {
                                    "action-7a9cf8": {
                                        "displayName": "return to menu",
                                        "action": [
                                            {
                                                "condition": true,
                                                "events": [
                                                    {
                                                        "type": "transition",
                                                        "do": "dqZBSS"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                },
            }
          }
        }

let allTemplates = [pcc, newTemp, displayer];

exports.allTemplates = allTemplates;
exports.test1 = test1;
exports.test2 = test2;
exports.simple = simple;
exports.lights = lights;
exports.funcTest = funcTest;
