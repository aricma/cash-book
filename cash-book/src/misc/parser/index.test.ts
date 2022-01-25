import {transactionParser, cashInformationParser} from './index';


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

describe(transactionParser.name, () => {

    transactionsTestCases.forEach(([given, expected]) => test(`given "${given}", when called, then returns "${expected}"`, () => {
        expect(transactionParser(given)).toBe(expected);
    }));

});

const cashInformationTestCases: TestCases = [
    ...transactionsTestCases,
    ['', '0.00'],
];

describe(cashInformationParser.name, () => {

    cashInformationTestCases.forEach(([given, expected]) => test(`given "${given}", when called, then returns "${expected}"`, () => {
        expect(cashInformationParser(given)).toBe(expected);
    }));

});
