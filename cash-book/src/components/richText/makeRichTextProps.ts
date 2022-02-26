export interface VariablesMap<T> {
	default: (value: string) => T;
	[key: string]: (value: string) => T;
}

export type MakeRichTextProps = <T = any>(variablesMap: VariablesMap<T>) => (message: string) => Array<T>;
export const makeRichTextProps: MakeRichTextProps =
	<T = any>(variablesMap: VariablesMap<T>) =>
	(message: string): Array<T> => {
		return message.split(/(\$[a-zA-Z_]+)/g).reduce((richText: Array<T>, value) => {
			const isVar = /^\$[a-zA-Z_]+$/.test(value);
			if (isVar) {
				const varName = value.slice(1);
				return [...richText, variablesMap[varName](value)];
			} else {
				return [...richText, variablesMap.default(value)];
			}
		}, []);
	};
