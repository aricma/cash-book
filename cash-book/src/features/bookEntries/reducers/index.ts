import { makeReducer } from './reducer';
import { DateWithoutTime } from '../../../models/domain/date';

export const reducer = makeReducer(() => DateWithoutTime.new().toISOString());
