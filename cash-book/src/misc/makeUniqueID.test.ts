import { makeUniqueID } from './makeUniqueID';

describe(makeUniqueID.name, () => {
	test('when called then returns a sha1 hash', () => {
		const id = makeUniqueID();
		expect(typeof id).toBe('string');
		expect(id.length).toBe(40);
	});

	test('when called in a loop, then returns a unique sha1 hash for each call', () => {
		const ids = Array(10).fill(null).map(makeUniqueID);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
