import { makeBackupMigrations } from './makeBackupMigrations';

describe(makeBackupMigrations.name, () => {
	type A = {
		__version__: 'v1';
		some: string;
	};

	const toA = (_: any): A => ({
		__version__: 'v1',
		some: '',
	});

	type B = {
		__version__: 'v2';
		some: string;
		other: string;
	};

	const toB = (a: A): B => ({
		__version__: 'v2',
		some: a.some,
		other: '',
	});

	type C = {
		__version__: 'v3';
		changed: string;
		other: string;
	};

	const toC = (b: B): C => ({
		__version__: 'v3',
		changed: b.some,
		other: b.other,
	});

	const migrate = makeBackupMigrations([
		[undefined, toA],
		['v1', toB],
		['v2', toC],
	]);

	[
		[
			{},
			{
				__version__: 'v3',
				changed: '',
				other: '',
			},
		],
		[
			{
				__version__: 'v1',
				some: 'value',
			},
			{
				__version__: 'v3',
				changed: 'value',
				other: '',
			},
		],
		[
			{
				__version__: 'v2',
				some: 'value',
				other: 'any',
			},
			{
				__version__: 'v3',
				changed: 'value',
				other: 'any',
			},
		],
		[
			{
				__version__: 'v3',
				changed: 'A',
				other: 'B',
			},
			{
				__version__: 'v3',
				changed: 'A',
				other: 'B',
			},
		],
	].forEach(([from, to]) => {
		test('given some version and migrations,when called, then executes the migrations in order', () => {
			expect(migrate(from)).toEqual(to);
		});
	});
});
