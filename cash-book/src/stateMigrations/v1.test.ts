import {toV2, V1} from './v1';
import {V2} from './v2';


describe(toV2.name, () => {

    test('given a state v1 with create, then returns state v2', () => {
        const v1: V1 = {
            __version__: "v1",
            global: {
                type: "",
            },
            settings: {
                save: "",
            },
            accounts: {
                create: {
                    type: "",
                },
                accounts: {},
            },
            transactions: {
                create: {
                    transactionIds: [],
                    transactions: {},
                },
                templates: {},
                transactions: {},
            },
            bookEntries: {
                create: {
                    templates: {
                        "1": {
                            date: "0-0-1",
                            templateId: "A",
                            transactions: {
                                "T-1": "10",
                                "T-3": "10",
                                "T-2": "15",
                            },
                        },
                    },
                },
                templates: {}
            }
        };

        const v2: V2 = {
            __version__: "v2",
            global: {
                type: "",
            },
            settings: {
                save: "",
            },
            accounts: {
                create: {
                    type: "",
                },
                accounts: {},
            },
            transactions: {
                create: {
                    transactionIds: [],
                    transactions: {},
                },
                templates: {},
                transactions: {},
            },
            bookEntries: {
                create: {
                    templates: {
                        "1": {
                            date: "0-0-1",
                            templateId: "A",
                            cash: {
                                start: "0",
                                end: "0",
                            },
                            transactions: {
                                "T-1": "10",
                                "T-3": "10",
                                "T-2": "15",
                            },
                        },
                    },
                },
                templates: {}
            }
        };

        expect(toV2(v1)).toEqual(v2);
    });

    test('given a state v1 with entries, then returns state v2', () => {
        const v1: V1 = {
            __version__: "v1",
            global: {
                type: "",
            },
            settings: {
                save: "",
            },
            accounts: {
                create: {
                    type: "",
                },
                accounts: {},
            },
            transactions: {
                create: {
                    transactionIds: [],
                    transactions: {},
                },
                templates: {},
                transactions: {},
            },
            bookEntries: {
                create: {
                    templates: {},
                },
                templates: {
                    "1": {
                        "0-0-1": {
                            date: "0-0-1",
                            templateId: "1",
                            transactions: {
                                "1": 5,
                                "2": 10,
                                "3": 15,
                            }
                        },
                        "0-0-2": {
                            date: "0-0-2",
                            templateId: "1",
                            transactions: {
                                "1": 5,
                                "2": 10,
                                "3": 15,
                            }
                        },
                        "0-0-3": {
                            date: "0-0-3",
                            templateId: "1",
                            transactions: {
                                "1": 5,
                                "2": 10,
                                "3": 15,
                            }
                        },
                    }
                }
            }
        };

        const v2: V2 = {
            __version__: "v2",
            global: {
                type: "",
            },
            settings: {
                save: "",
            },
            accounts: {
                create: {
                    type: "",
                },
                accounts: {},
            },
            transactions: {
                create: {
                    transactionIds: [],
                    transactions: {},
                },
                templates: {},
                transactions: {},
            },
            bookEntries: {
                create: {
                    templates: {},
                },
                templates: {
                    "1": {
                        "0-0-1": {
                            date: "0-0-1",
                            templateId: "1",
                            cash: {
                                start: "0",
                                end: "0",
                            },
                            transactions: {
                                "1": "5",
                                "2": "10",
                                "3": "15",
                            }
                        },
                        "0-0-2": {
                            date: "0-0-2",
                            templateId: "1",
                            cash: {
                                start: "0",
                                end: "0",
                            },
                            transactions: {
                                "1": "5",
                                "2": "10",
                                "3": "15",
                            }
                        },
                        "0-0-3": {
                            date: "0-0-3",
                            templateId: "1",
                            cash: {
                                start: "0",
                                end: "0",
                            },
                            transactions: {
                                "1": "5",
                                "2": "10",
                                "3": "15",
                            }
                        },
                    }
                }
            }
        };

        expect(toV2(v1)).toEqual(v2);
    });

});
