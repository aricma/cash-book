import { DateWithoutTime } from './domain/date';

export const compact = <T>(xs: Array<T | undefined>): Array<T> => xs.filter((x) => x !== undefined) as Array<T>;

export const compactObject = <T>(xs: { [key: string]: T | undefined }): { [key: string]: T } =>
	Object.fromEntries(Object.entries(xs).filter(([key, value]) => value !== undefined)) as { [key: string]: T };

export const allFromEnum = (x: object /*Enum*/) => Object.keys(x).filter((item) => isNaN(Number(item)));

export const toNumber = (value: string): number | undefined =>
	Number.isNaN(Number(value)) ? undefined : Number(value);

export const toInt = (value: string): number | undefined => {
	if (value === '') return undefined;
	if (Number.isNaN(Number(value))) return undefined;
	if (/^\d+$/.test(value)) return Number(value);
	// if (/^\d+[,.]\d$/.test(value)) return Number(value.replace(/[,.]/, '') + "0");
	if (/^\d+[,.]\d{2}$/.test(value)) return Number(value.replace(/[,.]/, ''));
	return undefined;
};

export type PrecedenceTable<A, B> = Array<[A, B, -1 | 0 | 1]>;
export const isPrecedent =
	<A, B>(table: PrecedenceTable<A, B>) =>
	(a: A, b: B): number => {
		const row = table.find((row) => row[0] === a && row[1] === b) || undefined;
		return row === undefined ? 0 : row[2];
	};

export const pad = (num: number, size: number, char?: string): string => {
	let asString = num.toString();
	while (asString.length < size) asString = (char || '0') + asString;
	return asString;
};

export const dateIsInRange = (date: Date, from: Date, to: Date): boolean => {
	return from <= date && to > date;
};

export const getAllDatesInRange = (from: Date, to: Date): Array<Date> => {
	const addOneDate = (dates: Array<Date>, to: Date): Array<Date> => {
		const lastDateFromDates: Date | undefined = dates[dates.length - 1];
		if (lastDateFromDates === undefined) return [];
		const nextDate = addDays(lastDateFromDates, 1);
		if (nextDate >= to) {
			return dates;
		} else {
			const newDates = [...dates, nextDate];
			return addOneDate(newDates, to);
		}
	};
	return addOneDate([from], to);
};

export const move = <T>(arr: Array<T>, fromIndex: number, toIndex: number): Array<T> => {
	const maxIndex = arr.length - 1;
	if (fromIndex < 0 || maxIndex < fromIndex || toIndex < 0) return arr;
	const element = arr[fromIndex];
	const newOrder = [...arr];
	newOrder.splice(fromIndex, 1);
	newOrder.splice(toIndex, 0, element);
	return newOrder;
};

export const getFirstDateOfTheMonth = (date: Date): Date => {
	return DateWithoutTime.fromParts(date.getFullYear(), date.getMonth() + 1, 1);
};

export const getLastDateOfTheMonth = (date: Date): Date => {
	return DateWithoutTime.fromParts(date.getFullYear(), date.getMonth() + 2, 0);
};

export const getFirstDateOfTheWeek = (date: Date): Date => {
	const currentWeekDay = date.getDay();
	switch (currentWeekDay) {
		case 0:
			return subtractDays(date, 6);
		case 1:
			return date;
		default:
			return subtractDays(date, currentWeekDay - 1);
	}
};

export const getLastDateOfTheWeek = (date: Date): Date => {
	const currentWeekDay = date.getDay();
	switch (currentWeekDay) {
		case 0:
			return date;
		case 1:
			return addDays(date, 6);
		default:
			return addDays(date, 8 - currentWeekDay);
	}
};

export const getWeekDay = (date: Date): number => {
	const weekday = date.getDay();
	return weekday === 0 ? 7 : weekday;
};

export const addDays = (date: Date, days: number): Date => {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() + days);
	return DateWithoutTime.toWithoutTime(newDate);
};

export const subtractDays = (date: Date, days: number): Date => {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() - days);
	return DateWithoutTime.toWithoutTime(newDate);
};

export const getAllYearsInRange = (from: Date, to: Date): Array<number> => {
	const fromYear = from.getFullYear();
	const toYear = to.getFullYear() + 1;
	return Array(toYear - fromYear)
		.fill(null)
		.map((_, index) => {
			return fromYear + index;
		});
};
