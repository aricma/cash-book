import {makeParser} from './makeParser';
import * as parsers from './parsers';

export { makeParser } from './makeParser'
export * as parsers from './parsers';

export const transactionOnFinishParser = makeParser([
    parsers.replaceCommaWithDot,
    parsers.removeMultipleFloatingPointsAndCommas,
    parsers.removeTrailingDots,
    parsers.addLeadingFloatValueZero,
    parsers.addMissingTrailingZero,
    parsers.addMissingTrailingZeros,
    parsers.removeLeadingZeroBeforeLastZeroBeforeDot,
    parsers.removeLeadingZeroBeforeOtherDigits,
]);

export const cashInformationOnFinishParser = makeParser([
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
