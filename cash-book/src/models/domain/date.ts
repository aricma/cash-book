export const DateWithoutTime = {
	new: () => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	},
	fromString: (value: string): Date => {
		const date = new Date(value);
		date.setHours(0, 0, 0, 0);
		return date;
	},
	fromParts: (year: number, month: number, day: number): Date => {
		return new Date(year, month - 1, day);
	},
	toWithoutTime: (value: Date): Date => {
		const date = new Date(value);
		date.setHours(0, 0, 0, 0);
		return date;
	},
};
