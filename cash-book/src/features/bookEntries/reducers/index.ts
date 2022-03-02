import { makeReducer } from './reducer';
import { DateWithoutTime } from '../../../models/dateWithoutTime';

export const reducer = makeReducer(() => DateWithoutTime.new().toISOString());
