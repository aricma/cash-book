// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
import { BookEntries } from '../features/bookEntries/state';
import { pad, getFirstDateOfTheMonth, getLastDateOfTheMonth } from '../models/utils';
import { DateWithoutTime } from '../models/dateWithoutTime';

export const exportToFile = (content: string, name: string) => {
	const link = document.createElement('a');
	link.setAttribute('href', encodeURI(content));
	link.setAttribute('download', name);
	link.setAttribute('class', 'hidden');
	document.body.appendChild(link);
	link.click();
	link.remove();
};

export const toCSVContent = (rows: Array<Array<string>>): string => {
	return 'data:text/csv;charset=utf-8,' + rows.map((row) => row.map((cell) => `"${cell}"`).join(';')).join('\n');
};

export const toJSONContent = (object: any) => {
	return 'data:text/json;charset=utf-8,' + JSON.stringify(object);
};

export const setInLocalStorage = (key: string, value: string) => {
	window.localStorage.setItem(key, value);
};

export const removeFromLocalStorage = (key: string) => {
	window.localStorage.removeItem(key);
};

export const loadFromLocalStorage = (key: string) => {
	return window.localStorage.getItem(key) || undefined;
};

export const toDateString = (date: string): string => {
	const parsed = DateWithoutTime.fromString(date);
	const year = parsed.getFullYear();
	const month = pad(parsed.getMonth() + 1, 2);
	const day = pad(parsed.getDate(), 2);
	return `${year}-${month}-${day}`;
};

export const bookEntriesForMonth = (date: Date, bookEntries: BookEntries): BookEntries => {
	const fromDate = getFirstDateOfTheMonth(date).getTime();
	const toDate = getLastDateOfTheMonth(date).getTime();
	return Object.fromEntries(
		Object.entries(bookEntries).filter(([date, _]) => {
			const currentDate = DateWithoutTime.fromString(date).getTime();
			return fromDate <= currentDate && currentDate < toDate;
		})
	);
};

export const toLowerCaseWithDashes = (value: string): string => {
	return value.replace(/[\s_]+/, '-').toLowerCase();
};
