import { validateDatevRows } from './datev';
import { validRows, invalidRows } from './fixtures';

describe(validateDatevRows.name, () => {
	test('given valid rows, when called, then returns null', () => {
		expect(validateDatevRows(validRows)).toBe(null);
	});

	test('given invalid rows, when called, then returns error message', () => {
		expect(validateDatevRows(invalidRows)).toStrictEqual(expect.any(String));
	});
});
