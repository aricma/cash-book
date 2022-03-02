/**
 * CurrencyInt is a virtual type extending the Number type
 * meaning that there is no CurrencyInt type only the Number type
 * but the CurrencyInt gets created and parsed with certain rules
 *
 * we use CurrencyInt to do any calculations, avoiding any unwanted floating point errors
 * https://stackoverflow.com/a/3439981/8111715
 * https://floating-point-gui.de/basic/
 *
 * e.g.
 * - we go from string to CurrencyInt: "30.25" -> 3025
 * - we go from CurrencyInt to string: 3025 -> "30.25"
 * - negative values keep the sign: "-5.2" -> -520
 */

export const CurrencyInt = {
	fromString: (value: string): number | null => {
		if (/^[+-]?\d+$/.test(value)) return Number(value + '00');
		if (/^[+-]?\d+[,.]\d$/.test(value)) return Number(value.replaceAll(/[+,.]/g, '') + '0');
		if (/^[+-]?\d+[,.]\d{2}$/.test(value)) return Number(value.replaceAll(/[+,.]/g, ''));
		return null;
	},

	fromStringOr: (value: string, orElse: number): number => {
		const result = CurrencyInt.fromString(value);
		return result === null ? orElse : result;
	},

	toString: (value: number, withSign: boolean = false) => {
		const sign = withSign ? (value > 0 ? '+' : '-') : value > 0 ? '' : '-';
		const parsedValue = sign + String(Math.abs(value) / 100);
		if (/^[+-]?\d+$/.test(parsedValue)) return parsedValue + '.00';
		if (/^[+-]?\d+[,.]\d$/.test(parsedValue)) return parsedValue + '0';
		return parsedValue;
	},
};
