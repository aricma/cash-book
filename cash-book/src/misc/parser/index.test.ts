import {transactionOnFinishParser, cashInformationOnFinishParser} from './index';


type TestCases = Array<[given: string, expected: string]>;
const transactionsTestCases: TestCases = [
    ['0', '0.00'],
    ['0.', '0.00'],
    ['0,', '0.00'],
    ['0,0', '0.00'],
    ['00,0', '0.00'],
    ['004', '4.00'],
    ['3', '3.00'],
    ['3,,4', '3.40'],
    ['..45', '0.45'],
    [',.,6', '0.60'],
];

describe(transactionOnFinishParser.name, () => {

    transactionsTestCases.forEach(([given, expected]) => test(`given "${given}", when called, then returns "${expected}"`, () => {
        expect(transactionOnFinishParser(given)).toBe(expected);
    }));

});

const cashInformationTestCases: TestCases = [
    ...transactionsTestCases,
    ['', '0.00'],
];

describe(cashInformationOnFinishParser.name, () => {

    cashInformationTestCases.forEach(([given, expected]) => test(`given "${given}", when called, then returns "${expected}"`, () => {
        expect(cashInformationOnFinishParser(given)).toBe(expected);
    }));

});
