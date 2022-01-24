import { makeStateValidation } from './makeStateValidation';
import { validateEntries } from './validateEntries';
import { validateTransactions } from './validateTransactions';

export const stateValidation = makeStateValidation([validateEntries, validateTransactions]);
