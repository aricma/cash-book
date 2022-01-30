import { ApplicationState } from '../../../applicationState';
import { TransactionsViewProps } from '../props/transactionsViewProps';
import { toDataTransactionsViewProps } from './toDataTransactionsViewProps';
import { toSkeletonTransactionsViewProps } from './toSkeletonTransactionsViewProps';
import { AccountType } from '../../accounts/state';
import { toMissingAccountsTransactionsViewProps } from './toMissingAccountsTransactionsViewProps';

export const toTransactionsViewProps = (appState: ApplicationState, openModal: () => void): TransactionsViewProps => {
	const hasNoTemplates = Object.keys(appState.transactions.templates).length === 0;
	const accounts = Object.values(appState.accounts.accounts);
	const cashierAccounts = accounts.filter((acc) => acc.type === AccountType.CASH_STATION);
	const differenceAccounts = accounts.filter((acc) => acc.type === AccountType.DIFFERENCE);
	const hasNoCashierAccounts = cashierAccounts.length === 0;
	const hasNoDifferenceAccounts = differenceAccounts.length === 0;
	switch (true) {
		case hasNoCashierAccounts:
		case hasNoDifferenceAccounts:
			return toMissingAccountsTransactionsViewProps();
		case hasNoTemplates:
			return toSkeletonTransactionsViewProps(appState, openModal);
		default:
			return toDataTransactionsViewProps(appState, openModal);
	}
};
