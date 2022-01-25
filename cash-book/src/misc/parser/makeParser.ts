export type ParserMap = (value: string) => string;

export interface Parser {
    pattern: RegExp,
    map: ParserMap,
}

export const makeParser = (parsers: Array<Parser>): ParserMap => (value: string): string => {
    return parsers.reduce((newValue, parser) => {
        return (parser.pattern.test(newValue)) ? parser.map(newValue) : newValue;
    }, value);
};
