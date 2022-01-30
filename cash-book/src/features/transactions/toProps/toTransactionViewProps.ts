import { ApplicationState, dispatch } from '../../../applicationState';
import { Template, Transaction, TransactionType } from '../state';
import { TransactionViewProps } from '../props/transactionsViewProps';
import { AccountType } from '../../accounts/state';
import { IconType } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';

export const toTransactionViewProps = (
	appState: ApplicationState,
	template: Template,
	transaction: Transaction
): TransactionViewProps | undefined => {
	const templateId = template.id;
	const [fromAccountId, toAccountId] =
		transaction.type === TransactionType.IN
			? [transaction.accountId, template.cashierAccountId]
			: [template.cashierAccountId, transaction.accountId];
	const fromAccount = appState.accounts.accounts[fromAccountId] || undefined;
	const toAccount = appState.accounts.accounts[toAccountId] || undefined;
	if (fromAccount === undefined) return undefined;
	if (toAccount === undefined) return undefined;
	const cashStation = fromAccount.type === AccountType.CASH_STATION ? fromAccount : toAccount;
	const direction =
		fromAccount.type === AccountType.CASH_STATION
			? IconType.ARROW_NARROW_RIGHT_STROKE
			: IconType.ARROW_NARROW_LEFT_STROKE;
	const otherAccount = fromAccount.type === AccountType.CASH_STATION ? toAccount : fromAccount;
	const order = template.transactions.findIndex((id) => id === transaction.id) + 1;
	return {
		order: order + '.',
		title: transaction.name,
		cashStation: {
			title: cashStation.name,
		},
		direction: direction,
		otherAccount: {
			title: otherAccount.name,
		},
		decreaseOrder: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CHEVRON_UP_FILL,
			title: 'Decrease Order',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_ORDER_DEC,
					templateId: templateId,
					transactionId: transaction.id,
				});
			},
		},
		increaseOrder: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CHEVRON_DOWN_FILL,
			title: 'Increase Order',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_ORDER_INC,
					templateId: templateId,
					transactionId: transaction.id,
				});
			},
		},
		move: (fromIndex: number, toIndex: number) => {
			dispatch({
				type: ApplicationActionType.TRANSACTIONS_MOVE,
				templateId: templateId,
				fromIndex: fromIndex,
				toIndex: toIndex,
			});
		},
	};
};
