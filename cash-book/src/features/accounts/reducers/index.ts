import { makeReducer } from './reducer';
import { makeUniqueID } from '../../../misc/makeUniqueID';

export const reducer = makeReducer(makeUniqueID);
