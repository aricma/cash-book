import { makeBackupValidation } from './makeBackupValidation';
import { validateEntries } from './validateEntries';
import { validateTransactions } from './validateTransactions';
import {validateVersion} from './validateVersion';

export const backupValidation = makeBackupValidation([
    validateVersion,
    validateEntries,
    validateTransactions
]);
