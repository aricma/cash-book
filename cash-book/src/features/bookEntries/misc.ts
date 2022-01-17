import {ApplicationState} from '../../applicationState';
import {AccountType} from '../accounts/state';
import {TransactionType, Transaction} from '../transactions/state';
import {toCurrencyInt} from '../../models/currencyInt';


export const transactionValue = (appState: ApplicationState): number => {
    const selectedTemplateId = appState.bookEntries.create.selectedTemplateId;
    if (selectedTemplateId === undefined) return 0;
    const template = appState.transactions.templates[selectedTemplateId];
    const config = appState.bookEntries.create.templates[selectedTemplateId];
    const accounts = Object.values(appState.accounts.accounts);
    const cashierAccount = accounts.find(({type}) => type === AccountType.CASH_STATION) || undefined;
    const differenceAccount = accounts.find(({type}) => type === AccountType.DIFFERENCE) || undefined;
    if (cashierAccount === undefined) return 0;
    if (differenceAccount === undefined) return 0;

    const transactionsWithValues: TransactionsWithValues = template.transactions.map((transactionId): TransactionWithValue => {
        const transaction = appState.transactions.transactions[transactionId];
        const value = config.transactions[transactionId] || "0";
        return {...transaction, value };
    });
    return getTransactionValue(transactionsWithValues);
};

export type TransactionWithValue = Transaction & { value: string };
export type TransactionsWithValues = Array<TransactionWithValue>;
export const getTransactionValue = (transactionsWithValues: TransactionsWithValues): number => {
    return transactionsWithValues.reduce((value, transaction) => {
        const transactionValue = toCurrencyInt(transaction.value) || 0;
        switch (transaction.type) {
            case TransactionType.IN:
            case TransactionType.SYS_IN:
                return value + transactionValue;
            case TransactionType.OUT:
            case TransactionType.SYS_OUT:
                return value - transactionValue;
        }
    }, 0) / 100;
};

// type AccountWithValue = Account & { value: number };
//
// interface AccountsWithValues {
//     [accountId: string]: AccountWithValue;
// }
//
// export const accountsWithValues = (appState: ApplicationState): AccountsWithValues => {
//     if (appState.bookEntries.selectedTemplateId === undefined) return {};
//     const template = appState.transactions.templates[appState.bookEntries.selectedTemplateId];
//     return Object.values(appState.accounts.accounts).reduce((accounts: AccountsWithValues, account) => {
//         const transactionWithValue = Object.entries(bookEntry.transactions).reduce(
//             (diffTransaction: (Transaction & { value: number }) | undefined, [transactionId, value]) => {
//                 const transaction = appState.transactions.transactions[transactionId];
//                 if (transaction.accountId === template.diffAccountId)
//                     return {
//                         ...transaction,
//                         value: transaction.type === TransactionType.SYS_OUT ? value : value * -1,
//                     };
//                 return undefined;
//             },
//             undefined,
//         );
//         if (transactionWithValue === undefined) return accounts;
//         const account = accounts[template.diffAccountId];
//         const diffAccount = appState.accounts.accounts[template.diffAccountId];
//         if (diffAccount === undefined) return accounts;
//         if (account === undefined)
//             return {
//                 ...accounts,
//                 [template.diffAccountId]: {
//                     title: diffAccount.name,
//                     number: diffAccount.number,
//                     value: transactionWithValue.value,
//                 },
//             };
//         const accountValue = toInt('' + account.value);
//         if (accountValue === undefined) return accounts;
//         const transactionValue = toInt('' + transactionWithValue.value);
//         if (transactionValue === undefined) return accounts;
//         const value = toInt('' + (accountValue + transactionValue));
//         if (value === undefined) return accounts;
//         return {
//             ...accounts,
//             [template.diffAccountId]: {
//                 title: account.title,
//                 number: account.number,
//                 value: value / 100,
//             },
//         };
//     }, {});
// };

// export const accountWithValue = (appState: ApplicationState, accountId: string): AccountWithValue => {
//     // const account = appState.accounts.accounts[accountId];
//     return Object.values(appState.transactions.accounts).reduce((accounts: AccountsWithValues, account) => {
//         const transactionWithValue = Object.entries(bookEntry.transactions).reduce(
//             (diffTransaction: (Transaction & { value: number }) | undefined, [transactionId, value]) => {
//                 const transaction = appState.transactions.transactions[transactionId];
//                 if (transaction.accountId === template.diffAccountId)
//                     return {
//                         ...transaction,
//                         value: transaction.type === TransactionType.SYS_OUT ? value : value * -1,
//                     };
//                 return undefined;
//             },
//             undefined,
//         );
//         if (transactionWithValue === undefined) return accounts;
//         const account = accounts[template.diffAccountId];
//         const diffAccount = appState.accounts.accounts[template.diffAccountId];
//         if (diffAccount === undefined) return accounts;
//         if (account === undefined)
//             return {
//                 ...accounts,
//                 [template.diffAccountId]: {
//                     title: diffAccount.name,
//                     number: diffAccount.number,
//                     value: transactionWithValue.value,
//                 },
//             };
//         const accountValue = toInt('' + account.value);
//         if (accountValue === undefined) return accounts;
//         const transactionValue = toInt('' + transactionWithValue.value);
//         if (transactionValue === undefined) return accounts;
//         const value = toInt('' + (accountValue + transactionValue));
//         if (value === undefined) return accounts;
//         return {
//             ...accounts,
//             [template.diffAccountId]: {
//                 title: account.title,
//                 number: account.number,
//                 value: value / 100,
//             },
//         };
//     }, {});
// };
