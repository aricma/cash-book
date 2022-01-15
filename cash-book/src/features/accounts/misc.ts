import {PrecedenceTable} from '../../models/utils';
import {AccountType} from './state';


export const accountTypePrecedenceTable: PrecedenceTable<AccountType, AccountType> = [
    [AccountType.CASH_STATION, AccountType.CASH_STATION, 0],
    [AccountType.CASH_STATION, AccountType.DIFFERENCE, -1],
    [AccountType.CASH_STATION, AccountType.DEFAULT, -1],
    [AccountType.DIFFERENCE, AccountType.CASH_STATION, 1],
    [AccountType.DIFFERENCE, AccountType.DIFFERENCE, 0],
    [AccountType.DIFFERENCE, AccountType.DEFAULT, -1],
    [AccountType.DEFAULT, AccountType.CASH_STATION, 1],
    [AccountType.DEFAULT, AccountType.DIFFERENCE, 1],
    [AccountType.DEFAULT, AccountType.DEFAULT, 0],
];
