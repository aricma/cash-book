import {makeParser} from './makeParser';
import * as parsers from './parsers';

export { makeParser } from './makeParser'
export * as parsers from './parsers';

export const transactionParser = makeParser([
    parsers.replaceCommaWithDot,
    parsers.removeMultipleFloatingPointsAndCommas,
    parsers.removeTrailingDots,
    parsers.addLeadingFloatValueZero,
    parsers.addMissingTrailingZero,
    parsers.addMissingTrailingZeros,
    parsers.removeLeadingZeroBeforeLastZeroBeforeDot,
    parsers.removeLeadingZeroBeforeOtherDigits,
]);

export const cashInformationParser = makeParser([
    parsers.replaceEmptyStringWithZero,

    parsers.replaceCommaWithDot,
    parsers.removeMultipleFloatingPointsAndCommas,
    parsers.removeTrailingDots,
    parsers.addLeadingFloatValueZero,
    parsers.addMissingTrailingZero,
    parsers.addMissingTrailingZeros,
    parsers.removeLeadingZeroBeforeLastZeroBeforeDot,
    parsers.removeLeadingZeroBeforeOtherDigits,
]);
