import { Parser } from './makeParser';

export const addLeadingFloatValueZero: Parser = {
	pattern: /^[.]/,
	map: (value: string): string => '0' + value,
};

export const replaceCommaWithDot: Parser = {
	pattern: /[,]+/,
	map: (value: string): string => value.replace(/[,]+/g, '.'),
};

export const replaceMultipleFloatingPointsAndCommas: Parser = {
	pattern: /[,.]{2,}/,
	map: (value: string): string => value.replace(/[,.]+/g, '.'),
};

// export const replaceInvalidWithZero: Parser = {
//     pattern: /^((?!\d+[.]\d+).)*$/,
//     map: (): string => '0',
// };
//
// export const replaceComplexZeroWithZero: Parser = {
//     pattern: /^0+([.]0*)?$/,
//     map: (): string => '0',
// };
//
export const removeTrailingDecimalSystems: Parser = {
	pattern: /^\d+([.]\d*)+$/,
	map: (value: string): string => value.split(/[.]/).slice(0, 2).join('.'),
};

export const removeLeadingZeroBeforeOtherDigits: Parser = {
	pattern: /^0+[^0]\./,
	map: (value: string): string => value.replace(/^0+/, ''),
};

export const removeLeadingZeroBeforeLastZeroBeforeDot: Parser = {
	pattern: /^0+\./,
	map: (value: string): string => value.replace(/^0+\./, '0.'),
};

export const removeTrailingDots: Parser = {
	pattern: /[.]$/,
	map: (value: string): string => value.slice(0, -1),
};

export const addMissingTrailingZero: Parser = {
	pattern: /[.]\d$/,
	map: (value: string): string => value + '0',
};

export const addMissingTrailingZeros: Parser = {
	pattern: /^\d+$/,
	map: (value: string): string => value + '.00',
};

export const replaceEmptyStringWithZero: Parser = {
	pattern: /^$/,
	map: (): string => '0',
};
