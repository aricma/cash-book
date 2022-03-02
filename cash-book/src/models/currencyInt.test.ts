import { CurrencyInt } from './currencyInt';

describe(CurrencyInt.fromString.name, () => {
	const testCases: Array<[string, number | null]> = [
		['5', 500],
		['5.2', 520],
		['+100.50', 10050],
		['-10.40', -1040],
		['hello world', null],
	];

	testCases.forEach(([value, expected]) => {
		test(`given ${value}, when called, then expected`, () => {
			expect(CurrencyInt.fromString(value)).toBe(expected);
		});
	});
});

describe(CurrencyInt.fromStringOr.name, () => {
	const testCases: Array<[string, number]> = [
		['+100.50', 10050],
		['-10.40', -1040],
		['hello world', 0],
	];

	testCases.forEach(([value, expected]) => {
		test(`given ${value}, when called, then returns ${expected}`, () => {
			expect(CurrencyInt.fromStringOr(value, 0)).toBe(expected);
		});
	});
});

describe(CurrencyInt.toString.name, () => {
	const testCases: Array<[number, boolean, string]> = [
		[500, true, '+5.00'],
		[500, false, '5.00'],
		[-500, true, '-5.00'],
		[-500, false, '-5.00'],
		[520, false, '5.20'],
		[10050, true, '+100.50'],
		[-1040, false, '-10.40'],
		[1022, false, '10.22'],
	];

	testCases.forEach(([value, withSign, expected]) => {
		test(`given ${value} and withSign: ${withSign}, when called, then returns ${expected}`, () => {
			expect(CurrencyInt.toString(value, withSign)).toBe(expected);
		});
	});
});
