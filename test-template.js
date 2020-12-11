


////////////////////////////////////////////////////////////////////////
 /////////////////////simple nested states test//////////////////////////
////////////////////////////////////////////////////////////////////////

const test1 = {
    template_id: 1,
    roles: {
        system: {
            desc: "System",
        },
        default: {
            desc: "default role",
        },
    },
    machines: {
        0: {
            displayName: "/",
            parent: null,
            default: 111,
            concurrent: false,
            history: false,
            transitions: {
                21: {
                    displayName: "on-error",
                    from:  {machine: 0, uid: 111},
                    to: {machine: 0, uid: 112},
                },
                22: {
                    displayName: "error-on",
                    from: {machine: 0, uid: 112},
                    to: {machine: 0, uid: 111},
                }
            },
            states: {
                111: {
                    displayName: "on",
                    machine: 111,
                    composite: true,
                    entry: [],
                    exit: [],
                },
                112: {
                    displayName: "error",
                    machine: 112,
                    composite: true,
                    entry: [],
                    exit: [],
                }
            },
            actions: {
                1: {
                    displayName: "errorTransition",
                    111: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 21 }],
                        },
                    ],
                },
                2: {
                    displayName: "errorClear",
                    112: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 22 }],
                        },
                    ],
                },
            },
        },
        111: {
            displayName: "/on",
            parent: 0,
            default: 321,
            concurrent: false,
            history: true,
            transitions: {
                31: {
                    displayName: "red-green",
                    from: {machine: 111, uid: 321},
                    to: {machine: 111, uid: 323},
                },
                32: {
                    displayName: "green-yellow",
                    from: {machine: 111, uid: 323},
                    to: {machine: 111, uid: 322},
                },
                33: {
                    displayName: "yellow-red",
                    from: {machine: 111, uid: 322},
                    to: {machine: 111, uid: 321},
                },
            },
            states: {
                321: {
                    displayName: "red",
                    machine: 321,
                    composite: true,

                    //TODO: how to call actions with arguments.......
                    entry: [],
                    // entry: [
                    //     {action: 99, args: 2}
                    // ],
                    exit: [],
                },
                322: {
                    displayName: "yellow",
                    composite: false,
                    entry: [],
                    // entry: [
                    //     {action: 99, args: 1}
                    // ],
                    exit: [],
                },
                323: {
                    displayName: "green",
                    composite: false,
                    entry: [],
                    // entry: [
                    //     {action: 99, args: 3}
                    // ],
                    exit: [],
                },
            },
            actions: {
                // 99: {
                //     displayName: "setTimer",
                //     321: [
                //         {
                //             roles: ["system"],
                //             condition: true,
                //             events: [{ type: "function", 
                //                     do: {func: "setTimer",
                //                     //number of args to take
                //                         args: 1} }],
                //         },
                //     ],
                // },
                //TODO: talk about this, not sure if this is good idea
                //for now, testing conditions
                90: {
                    displayName: "changeLight",
                    //displayName: "timerComplete",
                    //actions that can be used in any state use "global"
                    "global": [
                        {
                            roles: ["system"],
                            //machineIsState, will take machine and state, will return true if machine is in that state
                            condition: {func: "machineInState",
                                        args: ["111","321"]},
                            events: [{ type: "action", do: 91 }],
                        },
                        {
                            roles: ["system"],
                            condition: {func: "machineInState",
                                        args: ["111","322"]},
                            events: [{ type: "action", do: 93 }],
                        },
                        {
                            roles: ["system"],
                            condition: {func: "machineInState",
                                        args: ["111","323"]},
                            events: [{ type: "action", do: 92 }],
                        },
                        {
                            roles: ["system"],
                            condition: true,
                            //broadcasts "do" could be object
                            events: [{ type: "broadcast", do: {machine: 0, action: 1} }],
                            //TODO: could use description property to describe whats going on?
                            descrpition: "if not in any of previous checked states, error transition triggered"
                        },
                    ],
                },
                91: {
                    displayName: "turnGreen",
                    321: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 31 }],
                        },
                    ],
                },
                92: {
                    displayName: "turnYellow",
                    323: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 32 }],
                        },
                    ],
                },
                93: {
                    displayName: "turnRed",
                    322: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 33 }],
                        },
                    ],
                },
            }
        },
        321: {
            displayName: "/on/red",
            parent: 111,
            default: 666,
            concurrent: false,
            history: false,
            transitions: {
                66: {
                    displayName: "sold-flashing",
                    from: 666,
                    to: 667,
                },
                67: {
                    displayName: "flashing-solid",
                    from: 667,
                    to: 666,
                }
            },
            states: {
                666: {
                    displayName: "solid",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                667: {
                    displayName: "flashing",
                    composite: false,
                    entry: [],
                    exit: [],
                }
            },
            actions: {
                6: {
                    displayName: "startFlashing",
                    666: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 66 }],
                        },
                    ],
                },
                7: {
                    displayName: "stopFlashing",
                    667: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 67 }],
                        },
                    ],
                }
            }
        },
        112: {
            displayName: "/error",
            parent: 0,
            default: 551,
            concurrent: false,
            history: false,
            transitions: {
                51: {
                    displayName: "off-blinking",
                    from: 552,
                    to: 551,
                },
                52: {
                    displayName: "blinking-off",
                    from: 551,
                    to: 552,
                }
            },
            states: {
                551: {
                    displayName: "blinking",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                552: {
                    displayName: "off",
                    composite: false,
                    entry: [],
                    exit: [],
                }
            },
            actions: {
                91: {
                    displayName: "turnOff",
                    551: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 52 }],
                        },
                    ],
                },
                92: {
                    displayName: "startBlinking",
                    552: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 51 }],
                        },
                    ],
                }
            }
        }
    }
}

  ////////////////////////////////////////////////////////////////////////
 /////////////////////concurrent nested machine//////////////////////////
////////////////////////////////////////////////////////////////////////

const test2 = {
    template_id: 2,
    roles: {
        system: {
            desc: "System",
        },
        default: {
            desc: "default role",
        },
    },
    machines: {
        0: {
            displayName: "/",
            parent: null,
            default: 110,
            concurrent: false,
            history: false,
            transitions: {
                21: {
                    displayName: "active-injured",
                    from: 111,
                    to: 112,
                },
                22: {
                    displayName: "injured-active",
                    from: 112,
                    to: 111,
                }
            },
            states: {
                110: {
                    displayName: "active",
                    machine: 110,
                    composite: true,
                    entry: [],
                    exit: [],
                },
                112: {
                    displayName: "injured",
                    machine: 112,
                    composite: true,
                    entry: [],
                    exit: [],
                }
            },
            actions: {
                1: {
                    displayName: "injury",
                    111: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 21 }],
                        },
                    ],
                },
                2: {
                    displayName: "healed",
                    112: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 22 }],
                        },
                    ],
                },
            },
        },
        110: {
            displayName: "/active",
            parent: 0,
            default: false,
            concurrent: true,
            history: false,
            transitions: {},
            states: {
                211: {
                    displayName: "activity",
                    machine: 211,
                    composite: true,
                    entry: [],
                    exit: [],
                },
                212: {
                    displayName: "healthy",
                    composite: false,
                    entry: [],
                    exit: [],
                }
            },
            actions: {},
        },
        211: {
            displayName: "/active/activity",
            parent: 110,
            default: 320,
            concurrent: false,
            history: false,
            transitions: {
                11: {
                    displayName: "running-resting",
                    from: 321,
                    to: 320,
                },
                12: {
                    displayName: "soccer-resting",
                    from: 322,
                    to: 320,
                },
                13: {
                    displayName: "basketball-resting",
                    from: 323,
                    to: 320,
                },
                21: {
                    displayName: "resting-running",
                    from: 320,
                    to: 321,
                },
                22: {
                    displayName: "resting-soccer",
                    from: 320,
                    to: 322,
                },
                23: {
                    displayName: "resting-basketball",
                    from: 320,
                    to: 323,
                },
                31: {
                    displayName: "running-soccer",
                    from: 321,
                    to: 322,
                },
                32: {
                    displayName: "running-basketball",
                    from: 321,
                    to: 323,
                },
                41: {
                    displayName: "soccer-running",
                    from: 322,
                    to: 321,
                },
                42: {
                    displayName: "soccer-basketball",
                    from: 322,
                    to: 323,
                },
                51: {
                    displayName: "basketball-running",
                    from: 323,
                    to: 321,
                },
                52: {
                    displayName: "basketball-soccer",
                    from: 323,
                    to: 322,
                },
            },
            states: {
                320: {
                    displayName: "resting",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                321: {
                    displayName: "running",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                322: {
                    displayName: "soccer",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                323: {
                    displayName: "basketball",
                    composite: false,
                    entry: [],
                    exit: [],
                },
            },
            actions: {
                90: {
                    displayName: "rest",
                    321: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 11 }],
                        },
                    ],
                    322: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 12 }],
                        },
                    ],
                    323: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 13 }],
                        },
                    ],
                },
                91: {
                    displayName: "goRunning",
                    320: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 21 }],
                        },
                    ],
                    322: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 41 }],
                        },
                    ],
                    323: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 51 }],
                        },
                    ],
                },
                92: {
                    displayName: "playSoccer",
                    320: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 22 }],
                        },
                    ],
                    321: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 31 }],
                        },
                    ],
                    323: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 52 }],
                        },
                    ],
                },
                93: {
                    displayName: "playBasketball",
                    320: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 23 }],
                        },
                    ],
                    321: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 32 }],
                        },
                    ],
                    322: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 42 }],
                        },
                    ],
                },
            }
        },
        112: {
            displayName: "/injury",
            parent: 0,
            default: 551,
            concurrent: false,
            history: false,
            transitions: {
                51: {
                    displayName: "new_injury-treating_injury",
                    from: 551,
                    to: 552,
                },
                52: {
                    displayName: "treating_injury-healed",
                    from: 552,
                    to: 553,
                }
            },
            states: {
                551: {
                    displayName: "new_injury",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                552: {
                    displayName: "treating_injury",
                    composite: false,
                    entry: [],
                    exit: [],
                },
                553: {
                    displayName: "healed",
                    composite: false,
                    entry: [],
                    exit: [],
                }
            },
            actions: {
                91: {
                    displayName: "start_treatment",
                    551: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 51 }],
                        },
                    ],
                },
                92: {
                    displayName: "finish_treatment",
                    552: [
                        {
                            roles: ["system"],
                            condition: true,
                            events: [{ type: "transition", do: 52 }],
                        },
                    ],
                }
            }
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////
/**
 * NEW TEMPLATES
 */

const simple = {
	"uid": "tbb",
	"roles": {
		"default-role": {
			"displayName": "Default role"
		}
	},
	"machines": {
		"0": {
			"displayName": "/",
			"parent": null,
			"default": "state-47532a",
			"concurrent": false,
			"history": false,
			"transitions": {
				"abd4fb": {
					"displayName": "not_for_sale-listed_property",
					"from": {
						"machine": 0,
						"uid": "state-47532a"
					},
					"to": {
						"machine": 0,
						"uid": "state-2b2fc0"
					}
				},
				"33fb03": {
					"displayName": "listed_property-not_for_sale",
					"from": {
						"machine": 0,
						"uid": "state-2b2fc0"
					},
					"to": {
						"machine": 0,
						"uid": "state-47532a"
					}
				},
				"dd25cd": {
					"displayName": "listed_property-closing",
					"from": {
						"machine": 0,
						"uid": "state-2b2fc0"
					},
					"to": {
						"machine": 0,
						"uid": "state-aa3d7a"
					}
				}
			},
			"states": {
				"state-47532a": {
					"displayName": "not_for_sale",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				},
				"state-2b2fc0": {
					"displayName": "listed_property",
					"machine": "machine-94083e",
					"composite": true,
					"entry": [],
					"exit": []
				},
				"state-aa3d7a": {
					"displayName": "closing",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				}
			},
			"actions": {
				"action-705b0a": {
					"displayName": "list",
					"state-47532a": [{
						"roles": ["default-role"],
						"condition": [
                            {
                              "func": "roleCount",
                              "args": "default-role,>,2"
                            },
                            {
                              "func": "roleCount",
                              "args": "default-role,>,0"
                            }
                          ],
						"events": [{
							"type": "transition",
							"do": "abd4fb"
						}]
					}]
				},
				"action-462cc9": {
					"displayName": "take_off_market",
					"state-2b2fc0": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "33fb03"
						}]
					}]
				},
				"action-f0a5ea": {
					"displayName": "bid_selected",
					"state-2b2fc0": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "dd25cd"
						}]
					}]
				}
			}
		},
		"machine-94083e": {
			"displayName": "listed_property",
			"parent": "0",
			"default": null,
			"concurrent": true,
			"transitions": {},
			"history": false,
			"states": {
				"state-8af530": {
					"displayName": "viewings",
					"machine": "machine-1a8de1",
					"composite": true,
					"entry": [],
					"exit": []
				},
				"state-19dfb5": {
					"displayName": "bids",
					"machine": "machine-de9cbd",
					"composite": true,
					"entry": [],
					"exit": []
				}
			},
			"actions": {}
		},
		"machine-1a8de1": {
			"displayName": "viewings",
			"parent": "machine-94083e",
			"default": "state-fec815",
			"concurrent": false,
			"transitions": {
				"20c145": {
					"displayName": "not_available-available_for_viewing",
					"from": {
						"machine": "machine-1a8de1",
						"uid": "state-fec815"
					},
					"to": {
						"machine": "machine-1a8de1",
						"uid": "state-731e27"
					}
				},
				"1bd7aa": {
					"displayName": "available_for_viewing-not_available",
					"from": {
						"machine": "machine-1a8de1",
						"uid": "state-731e27"
					},
					"to": {
						"machine": "machine-1a8de1",
						"uid": "state-fec815"
					}
				}
			},
			"history": true,
			"states": {
				"state-fec815": {
					"displayName": "not_available",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				},
				"state-731e27": {
					"displayName": "available_for_viewing",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				}
			},
			"actions": {
				"action-9c7e8a": {
					"displayName": "change_viewing",
					"state-fec815": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "20c145"
						}]
					}],
					"state-731e27": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "1bd7aa"
						}]
					}]
				}
			}
		},
		"machine-de9cbd": {
			"displayName": "bids",
			"parent": "machine-94083e",
			"default": "state-e54f6f",
			"concurrent": false,
			"transitions": {
				"3dd6b5": {
					"displayName": "not_accepting-accepting",
					"from": {
						"machine": "machine-de9cbd",
						"uid": "state-e54f6f"
					},
					"to": {
						"machine": "machine-de9cbd",
						"uid": "state-664bbc"
					}
				},
				"f4d6b1": {
					"displayName": "accepting-not_accepting",
					"from": {
						"machine": "machine-de9cbd",
						"uid": "state-664bbc"
					},
					"to": {
						"machine": "machine-de9cbd",
						"uid": "state-e54f6f"
					}
				}
			},
			"history": true,
			"states": {
				"state-e54f6f": {
					"displayName": "not_accepting",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				},
				"state-664bbc": {
					"displayName": "accepting",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				}
			},
			"actions": {
				"action-a4bcd3": {
					"displayName": "change_bid",
					"state-e54f6f": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "3dd6b5"
						}]
					}],
					"state-664bbc": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "f4d6b1"
						}]
					}]
				}
			}
		}
	}
}

const lights = {
	"uid": "lights",
	"roles": {
		"default-role": {
			"displayName": "Default role"
		}
	},
	"machines": {
		"0": {
			"displayName": "root",
			"parent": null,
			"default": "state-921ac4",
			"concurrent": false,
			"history": false,
			"transitions": {
				"f098f2": {
					"displayName": "functioning-error_state",
					"from": {
						"machine": 0,
						"uid": "state-921ac4"
					},
					"to": {
						"machine": 0,
						"uid": "state-58c94d"
					}
				},
				"0d5b92": {
					"displayName": "error_state-functioning",
					"from": {
						"machine": 0,
						"uid": "state-58c94d"
					},
					"to": {
						"machine": 0,
						"uid": "state-921ac4"
					}
				}
			},
			"states": {
				"state-921ac4": {
					"displayName": "functioning",
					"machine": "machine-d7417e",
					"composite": true,
					"entry": [],
					"exit": []
				},
				"state-58c94d": {
					"displayName": "error_state",
					"machine": "machine-042202",
					"composite": true,
					"entry": [],
					"exit": []
				}
			},
			"actions": {
				"action-12c899": {
                    "displayName": "error",
					"state-921ac4": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "f098f2"
						}]
					}]
				},
				"action-424bde": {
                    "displayName": "error_resolved",
					"state-58c94d": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "0d5b92"
						}]
					}]
				}
			}
		},
		"machine-d7417e": {
			"displayName": "functioning",
			"parent": "0",
			"default": "state-57eb58",
			"concurrent": false,
            "history": true,
			"transitions": {
				"8a9442": {
					"displayName": "red-green",
					"from": {
						"machine": "machine-d7417e",
						"uid": "state-57eb58"
					},
					"to": {
						"machine": "machine-d7417e",
						"uid": "state-2efb42"
					}
				},
				"0ce029": {
					"displayName": "green-yellow",
					"from": {
						"machine": "machine-d7417e",
						"uid": "state-2efb42"
					},
					"to": {
						"machine": "machine-d7417e",
						"uid": "state-63f726"
					}
				},
				"6328c3": {
					"displayName": "yellow-red",
					"from": {
						"machine": "machine-d7417e",
						"uid": "state-63f726"
					},
					"to": {
						"machine": "machine-d7417e",
						"uid": "state-57eb58"
					}
				}
			},
			"states": {
				"state-57eb58": {
					"displayName": "red",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				},
				"state-2efb42": {
					"displayName": "green",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				},
				"state-63f726": {
					"displayName": "yellow",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				}
            },
            "display": {
                "state-57eb58":{
                    "default-role": {
                        "description": "",
                        "displayData": [
                            {title: 9},
                            {button: 2}
                        ]
                    }
                },
                "state-2efb42": {
                    "default-role": {
                        "description": "",
                        "displayData": [
                            {title: 10},
                            {button: 3}
                        ]
                    }
                },
                "state-63f726": {
                    "default-role": {
                        "description": "",
                        "displayData": [
                            {title: 11},
                            {button: 4}
                        ]
                    }
                }
            },
			"actions": {
				"action-59e570": {
                    "displayName": "switch_light",
					"state-57eb58": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "8a9442"
						}]
					}],
					"state-2efb42": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "0ce029"
						}]
					}],
					"state-63f726": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "6328c3"
						}]
					}]
				}
			}
		},
		"machine-042202": {
			"displayName": "error_state",
			"parent": "0",
			"default": "state-f9cc8c",
			"concurrent": false,
			"transitions": {
				"c0fc3a": {
					"displayName": "flashing-solid",
					"from": {
						"machine": "machine-042202",
						"uid": "state-c5df3d"
					},
					"to": {
						"machine": "machine-042202",
						"uid": "state-f9cc8c"
					}
				},
				"f06790": {
					"displayName": "solid-flashing",
					"from": {
						"machine": "machine-042202",
						"uid": "state-f9cc8c"
					},
					"to": {
						"machine": "machine-042202",
						"uid": "state-c5df3d"
					}
				}
			},
			"history": false,
			"states": {
				"state-c5df3d": {
					"displayName": "flashing",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				},
				"state-f9cc8c": {
					"displayName": "solid",
					"machine": null,
					"composite": false,
					"entry": [],
					"exit": []
				}
			},
			"actions": {
				"action-3df1d7": {
					"displayName": "switch",
					"state-c5df3d": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "c0fc3a"
						}]
					}],
					"state-f9cc8c": [{
						"roles": ["default-role"],
						"condition": true,
						"events": [{
							"type": "transition",
							"do": "f06790"
						}]
					}]
				}
			}
		}
	}
}

const funcTest = {
    "uid":"funcTest",
    "roles":{
       "default-role":{
          "displayName":"Default role"
       }
    },
    "machines":{
       "0":{
          "displayName":"/",
          "parent":null,
          "default": "state-a4fa78",
          "concurrent":false,
          "history":false,
          "transitions":{
             
          },
          "states":{
             "state-a4fa78":{
                "displayName":"basicly",
                "machine":null,
                "composite":false,
                "entry":[
                   
                ],
                "exit":[
                   
                ]
             }
          },
          "actions":{
             "action-cce909":{
                "displayName":"vote",
                "state-a4fa78":[
                   {
                      "roles":[
                         "default-role"
                      ],
                      "condition":true,
                      "events":[
                         {
                            "type":"function",
                            "do":{
                               "func":"vote",
                               "args":"first,epic style"
                            }
                         }
                      ]
                   }
                ]
             },
             "action-89969f":{
                "displayName":"checkVotes",
                "state-a4fa78":[
                   {
                      "roles":[
                         "default-role"
                      ],
                      "condition":true,
                      "events":[
                         {
                            "type":"function",
                            "do":{
                               "func":"getData",
                               "args":"first"
                            }
                         }
                      ]
                   }
                ]
             }
          }
       }
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
                                "english": {
                                    "default-role": {
                                        "description": "title",
                                        "displayData": [
                                            {title: 1},
                                            {button: 1}
                                        ]
                                    }
                                }
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
                                "english": {
                                    "default-role": {
                                        "description": "title",
                                        "displayData": [
                                            {title: 1},
                                            {button: 1}
                                        ]
                                    }
                                }
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
                                "english": {
                                    "default-role": {
                                        "description": "title",
                                        "displayData": [
                                            {title: 1},
                                            {button: 1}
                                        ]
                                    }
                                }
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
                                "english": {
                                    "default-role": {
                                        "description": "title",
                                        "displayData": [
                                            {title: 1},
                                            {button: 1}
                                        ]
                                    }
                                }
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
  
  

let allTemplates = [simple, lights, funcTest, newTemp];

exports.allTemplates = allTemplates;
exports.test1 = test1;
exports.test2 = test2;
exports.simple = simple;
exports.lights = lights;
exports.funcTest = funcTest;