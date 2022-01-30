import {backupValidation} from './index';
import {ValidationMap} from './makeBackupValidation';


describe(backupValidation.name, () => {

    test('given a valid v3, when called, then returns null', () => {
        const validV3 = {
            "__version__": "v3",
            "accounts": {
                "7ef4461eaf03725df64163ef4d3a77af491f3f84": {
                    "id": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "type": "ACCOUNT_TYPE/CASH_STATION",
                    "name": "K1",
                    "number": "1000"
                },
                "992aad9e9401dd73c5e9be67f9ad30f0d607f776": {
                    "id": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "type": "ACCOUNT_TYPE/DIFFERENCE",
                    "name": "D",
                    "number": "3400"
                },
                "e631e842f6120896ca5f74477c0041bbb0b15894": {
                    "id": "e631e842f6120896ca5f74477c0041bbb0b15894",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "B",
                    "number": "5600"
                },
                "15700616af207a2d82d2a32e15e3fca2649a6a5f": {
                    "id": "15700616af207a2d82d2a32e15e3fca2649a6a5f",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "G",
                    "number": "9800"
                }
            },
            "templates": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "id": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                    "name": "T-1",
                    "cashierAccountId": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "diffAccountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "transactions": [
                        "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                        "67949e956ef7bc08893705f172c3ad8564b85475"
                    ],
                    "autoDiffInId": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "autoDiffOutId": "049e11ed251929d2730f540595715c7757b26edc"
                }
            },
            "transactions": {
                "d18730889d885ad292b90a5f4d6ea5713ce83eb7": {
                    "id": "d18730889d885ad292b90a5f4d6ea5713ce83eb7",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "6ba3791ffdfea84dc4f69d02139556fe75c99e74": {
                    "id": "6ba3791ffdfea84dc4f69d02139556fe75c99e74",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0e0d0e7e9996714e745d9ae37234deed58330b33": {
                    "id": "0e0d0e7e9996714e745d9ae37234deed58330b33",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "ef52d14b685d56b3734d10239e596c5233349a3f": {
                    "id": "ef52d14b685d56b3734d10239e596c5233349a3f",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "a3577de19325d5150196b7524686b6b5f7512848": {
                    "id": "a3577de19325d5150196b7524686b6b5f7512848",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "15d3862971781389d5c05b124c8063160f41f148": {
                    "id": "15d3862971781389d5c05b124c8063160f41f148",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "0b9b92723dcf38ff575cf61d5d2c104538b489be": {
                    "id": "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "67949e956ef7bc08893705f172c3ad8564b85475": {
                    "id": "67949e956ef7bc08893705f172c3ad8564b85475",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": {
                    "id": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "049e11ed251929d2730f540595715c7757b26edc": {
                    "id": "049e11ed251929d2730f540595715c7757b26edc",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                }
            },
            "bookEntries": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "2022-01-29T23:00:00.000Z": {
                        "date": "2022-01-29T23:00:00.000Z",
                        "templateId": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                        "cash": {
                            "start": "0",
                            "end": "0"
                        },
                        "transactions": {
                            "0b9b92723dcf38ff575cf61d5d2c104538b489be": "50.00",
                            "67949e956ef7bc08893705f172c3ad8564b85475": "54.00",
                            "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": "4"
                        }
                    }
                }
            }
        };
        expect(backupValidation(validV3)).toBe(null);
    });

    test('given a valid v3 with missing version, when called, then returns error', () => {
        const validV3 = {
            "accounts": {
                "7ef4461eaf03725df64163ef4d3a77af491f3f84": {
                    "id": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "type": "ACCOUNT_TYPE/CASH_STATION",
                    "name": "K1",
                    "number": "1000"
                },
                "992aad9e9401dd73c5e9be67f9ad30f0d607f776": {
                    "id": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "type": "ACCOUNT_TYPE/DIFFERENCE",
                    "name": "D",
                    "number": "3400"
                },
                "e631e842f6120896ca5f74477c0041bbb0b15894": {
                    "id": "e631e842f6120896ca5f74477c0041bbb0b15894",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "B",
                    "number": "5600"
                },
                "15700616af207a2d82d2a32e15e3fca2649a6a5f": {
                    "id": "15700616af207a2d82d2a32e15e3fca2649a6a5f",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "G",
                    "number": "9800"
                }
            },
            "templates": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "id": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                    "name": "T-1",
                    "cashierAccountId": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "diffAccountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "transactions": [
                        "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                        "67949e956ef7bc08893705f172c3ad8564b85475"
                    ],
                    "autoDiffInId": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "autoDiffOutId": "049e11ed251929d2730f540595715c7757b26edc"
                }
            },
            "transactions": {
                "d18730889d885ad292b90a5f4d6ea5713ce83eb7": {
                    "id": "d18730889d885ad292b90a5f4d6ea5713ce83eb7",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "6ba3791ffdfea84dc4f69d02139556fe75c99e74": {
                    "id": "6ba3791ffdfea84dc4f69d02139556fe75c99e74",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0e0d0e7e9996714e745d9ae37234deed58330b33": {
                    "id": "0e0d0e7e9996714e745d9ae37234deed58330b33",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "ef52d14b685d56b3734d10239e596c5233349a3f": {
                    "id": "ef52d14b685d56b3734d10239e596c5233349a3f",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "a3577de19325d5150196b7524686b6b5f7512848": {
                    "id": "a3577de19325d5150196b7524686b6b5f7512848",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "15d3862971781389d5c05b124c8063160f41f148": {
                    "id": "15d3862971781389d5c05b124c8063160f41f148",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "0b9b92723dcf38ff575cf61d5d2c104538b489be": {
                    "id": "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "67949e956ef7bc08893705f172c3ad8564b85475": {
                    "id": "67949e956ef7bc08893705f172c3ad8564b85475",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": {
                    "id": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "049e11ed251929d2730f540595715c7757b26edc": {
                    "id": "049e11ed251929d2730f540595715c7757b26edc",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                }
            },
            "bookEntries": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "2022-01-29T23:00:00.000Z": {
                        "date": "2022-01-29T23:00:00.000Z",
                        "templateId": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                        "cash": {
                            "start": "0",
                            "end": "0"
                        },
                        "transactions": {
                            "0b9b92723dcf38ff575cf61d5d2c104538b489be": "50.00",
                            "67949e956ef7bc08893705f172c3ad8564b85475": "54.00",
                            "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": "4"
                        }
                    }
                }
            }
        };
        const expected: ValidationMap = {
            version: "Backup has not latest version!",
        }
        expect(backupValidation(validV3)).toEqual(expected);
    });

    test('given a v3 with missing account, when called, then returns error', () => {
        const validV3 = {
            "__version__": "v3",
            "accounts": {
                "7ef4461eaf03725df64163ef4d3a77af491f3f84": {
                    "id": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "type": "ACCOUNT_TYPE/CASH_STATION",
                    "name": "K1",
                    "number": "1000"
                },
                "992aad9e9401dd73c5e9be67f9ad30f0d607f776": {
                    "id": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "type": "ACCOUNT_TYPE/DIFFERENCE",
                    "name": "D",
                    "number": "3400"
                },
                "15700616af207a2d82d2a32e15e3fca2649a6a5f": {
                    "id": "15700616af207a2d82d2a32e15e3fca2649a6a5f",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "G",
                    "number": "9800"
                }
            },
            "templates": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "id": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                    "name": "T-1",
                    "cashierAccountId": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "diffAccountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "transactions": [
                        "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                        "67949e956ef7bc08893705f172c3ad8564b85475"
                    ],
                    "autoDiffInId": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "autoDiffOutId": "049e11ed251929d2730f540595715c7757b26edc"
                }
            },
            "transactions": {
                "d18730889d885ad292b90a5f4d6ea5713ce83eb7": {
                    "id": "d18730889d885ad292b90a5f4d6ea5713ce83eb7",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "6ba3791ffdfea84dc4f69d02139556fe75c99e74": {
                    "id": "6ba3791ffdfea84dc4f69d02139556fe75c99e74",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0e0d0e7e9996714e745d9ae37234deed58330b33": {
                    "id": "0e0d0e7e9996714e745d9ae37234deed58330b33",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "ef52d14b685d56b3734d10239e596c5233349a3f": {
                    "id": "ef52d14b685d56b3734d10239e596c5233349a3f",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "a3577de19325d5150196b7524686b6b5f7512848": {
                    "id": "a3577de19325d5150196b7524686b6b5f7512848",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "15d3862971781389d5c05b124c8063160f41f148": {
                    "id": "15d3862971781389d5c05b124c8063160f41f148",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "0b9b92723dcf38ff575cf61d5d2c104538b489be": {
                    "id": "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "67949e956ef7bc08893705f172c3ad8564b85475": {
                    "id": "67949e956ef7bc08893705f172c3ad8564b85475",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": {
                    "id": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "049e11ed251929d2730f540595715c7757b26edc": {
                    "id": "049e11ed251929d2730f540595715c7757b26edc",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                }
            },
            "bookEntries": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "2022-01-29T23:00:00.000Z": {
                        "date": "2022-01-29T23:00:00.000Z",
                        "templateId": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                        "cash": {
                            "start": "0",
                            "end": "0"
                        },
                        "transactions": {
                            "0b9b92723dcf38ff575cf61d5d2c104538b489be": "50.00",
                            "67949e956ef7bc08893705f172c3ad8564b85475": "54.00",
                            "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": "4"
                        }
                    }
                }
            }
        };
        const expected: ValidationMap = {
            accounts: 'Missing account for id!',
            transactions: null,
        }
        expect(backupValidation(validV3)).toEqual(expected);
    });

    test('given a valid v3 with missing transaction, when called, then returns error', () => {
        const validV3 = {
            "__version__": "v3",
            "accounts": {
                "7ef4461eaf03725df64163ef4d3a77af491f3f84": {
                    "id": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "type": "ACCOUNT_TYPE/CASH_STATION",
                    "name": "K1",
                    "number": "1000"
                },
                "992aad9e9401dd73c5e9be67f9ad30f0d607f776": {
                    "id": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "type": "ACCOUNT_TYPE/DIFFERENCE",
                    "name": "D",
                    "number": "3400"
                },
                "e631e842f6120896ca5f74477c0041bbb0b15894": {
                    "id": "e631e842f6120896ca5f74477c0041bbb0b15894",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "B",
                    "number": "5600"
                },
                "15700616af207a2d82d2a32e15e3fca2649a6a5f": {
                    "id": "15700616af207a2d82d2a32e15e3fca2649a6a5f",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "G",
                    "number": "9800"
                }
            },
            "templates": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "id": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                    "name": "T-1",
                    "cashierAccountId": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "diffAccountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "transactions": [
                        "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                        "67949e956ef7bc08893705f172c3ad8564b85475"
                    ],
                    "autoDiffInId": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "autoDiffOutId": "049e11ed251929d2730f540595715c7757b26edc"
                }
            },
            "transactions": {
                "67949e956ef7bc08893705f172c3ad8564b85475": {
                    "id": "67949e956ef7bc08893705f172c3ad8564b85475",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": {
                    "id": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "049e11ed251929d2730f540595715c7757b26edc": {
                    "id": "049e11ed251929d2730f540595715c7757b26edc",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                }
            },
            "bookEntries": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "2022-01-29T23:00:00.000Z": {
                        "date": "2022-01-29T23:00:00.000Z",
                        "templateId": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                        "cash": {
                            "start": "0",
                            "end": "0"
                        },
                        "transactions": {
                            "0b9b92723dcf38ff575cf61d5d2c104538b489be": "50.00",
                            "67949e956ef7bc08893705f172c3ad8564b85475": "54.00",
                            "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": "4"
                        }
                    }
                }
            }
        };
        const expected: ValidationMap = {
            accounts: null,
            templates: null,
            transactions: 'Missing transaction for id!',
        }
        expect(backupValidation(validV3)).toEqual(expected);
    });

    test('given a valid v3 with missing template, when called, then returns error', () => {
        const validV3 = {
            "__version__": "v3",
            "accounts": {
                "7ef4461eaf03725df64163ef4d3a77af491f3f84": {
                    "id": "7ef4461eaf03725df64163ef4d3a77af491f3f84",
                    "type": "ACCOUNT_TYPE/CASH_STATION",
                    "name": "K1",
                    "number": "1000"
                },
                "992aad9e9401dd73c5e9be67f9ad30f0d607f776": {
                    "id": "992aad9e9401dd73c5e9be67f9ad30f0d607f776",
                    "type": "ACCOUNT_TYPE/DIFFERENCE",
                    "name": "D",
                    "number": "3400"
                },
                "e631e842f6120896ca5f74477c0041bbb0b15894": {
                    "id": "e631e842f6120896ca5f74477c0041bbb0b15894",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "B",
                    "number": "5600"
                },
                "15700616af207a2d82d2a32e15e3fca2649a6a5f": {
                    "id": "15700616af207a2d82d2a32e15e3fca2649a6a5f",
                    "type": "ACCOUNT_TYPE/DEFAULT",
                    "name": "G",
                    "number": "9800"
                }
            },
            "templates": {

            },
            "transactions": {
                "d18730889d885ad292b90a5f4d6ea5713ce83eb7": {
                    "id": "d18730889d885ad292b90a5f4d6ea5713ce83eb7",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "6ba3791ffdfea84dc4f69d02139556fe75c99e74": {
                    "id": "6ba3791ffdfea84dc4f69d02139556fe75c99e74",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0e0d0e7e9996714e745d9ae37234deed58330b33": {
                    "id": "0e0d0e7e9996714e745d9ae37234deed58330b33",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "ef52d14b685d56b3734d10239e596c5233349a3f": {
                    "id": "ef52d14b685d56b3734d10239e596c5233349a3f",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "a3577de19325d5150196b7524686b6b5f7512848": {
                    "id": "a3577de19325d5150196b7524686b6b5f7512848",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "15d3862971781389d5c05b124c8063160f41f148": {
                    "id": "15d3862971781389d5c05b124c8063160f41f148",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "0b9b92723dcf38ff575cf61d5d2c104538b489be": {
                    "id": "0b9b92723dcf38ff575cf61d5d2c104538b489be",
                    "type": "TRANSACTION_TYPE/IN",
                    "name": "In",
                    "accountId": "15700616af207a2d82d2a32e15e3fca2649a6a5f"
                },
                "67949e956ef7bc08893705f172c3ad8564b85475": {
                    "id": "67949e956ef7bc08893705f172c3ad8564b85475",
                    "type": "TRANSACTION_TYPE/OUT",
                    "name": "Out",
                    "accountId": "e631e842f6120896ca5f74477c0041bbb0b15894"
                },
                "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": {
                    "id": "0c063da62b4b290693357c6e1a86fe99a9d9b4d4",
                    "name": "Auto Difference In",
                    "type": "TRANSACTION_TYPE/PROTECTED/IN",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                },
                "049e11ed251929d2730f540595715c7757b26edc": {
                    "id": "049e11ed251929d2730f540595715c7757b26edc",
                    "name": "Auto Difference Out",
                    "type": "TRANSACTION_TYPE/PROTECTED/OUT",
                    "accountId": "992aad9e9401dd73c5e9be67f9ad30f0d607f776"
                }
            },
            "bookEntries": {
                "d25d46ba48eddc50237d061eee101d6a9b39e587": {
                    "2022-01-29T23:00:00.000Z": {
                        "date": "2022-01-29T23:00:00.000Z",
                        "templateId": "d25d46ba48eddc50237d061eee101d6a9b39e587",
                        "cash": {
                            "start": "0",
                            "end": "0"
                        },
                        "transactions": {
                            "0b9b92723dcf38ff575cf61d5d2c104538b489be": "50.00",
                            "67949e956ef7bc08893705f172c3ad8564b85475": "54.00",
                            "0c063da62b4b290693357c6e1a86fe99a9d9b4d4": "4"
                        }
                    }
                }
            }
        };
        const expected: ValidationMap = {
            templates: 'Missing template for id!',
            transactions: null,
        }
        expect(backupValidation(validV3)).toEqual(expected);
    });

});
