import { ApplicationState, dispatch } from '../../../applicationState';
import { CreateTransaction, TransactionType } from '../state';
import { CreateTransactionViewProps } from '../props/createTemplateViewProps';
import { validateCreateTransaction } from './validation';
import { ApplicationActionType } from '../../../applicationState/actions';
import { IconType } from '../../../models/props';
import { AccountType } from '../../accounts/state';

export const toCreateTransactionViewProps = (
	appState: ApplicationState,
	order: number,
	transaction: CreateTransaction
): CreateTransactionViewProps => {
	const validationMap = validateCreateTransaction(transaction);
	return {
		order: order + '.',
		name: {
			type: 'TEXT_INPUT_PROPS_TYPE',
			value: transaction.name || '',
			placeholder: 'Name',
			validation: validationMap?.name,
			onChange: (value) => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME,
					transactionId: transaction.id,
					name: value,
				});
			},
		},
		cashierAccount: appState.accounts.accounts[appState.transactions.create.cashierAccountId || '']?.name || '',
		type: {
			type: 'BUTTON_PROPS_TYPE',
			icon:
				transaction.type === TransactionType.OUT
					? IconType.ARROW_NARROW_RIGHT_STROKE
					: IconType.ARROW_NARROW_LEFT_STROKE,
			title: 'Set transaction type',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE,
					transactionId: transaction.id,
					transactionType: transaction.type === TransactionType.OUT ? TransactionType.IN : TransactionType.OUT,
				});
			},
		},
		account: {
			type: 'OPTIONS_INPUT_PROPS_TYPE',
			value: appState.accounts.accounts[transaction.accountId || '']?.name || '',
			placeholder: 'set other account',
			validation: validationMap?.accountId,
			options: Object.values(appState.accounts.accounts)
				.filter(({ type }) => type === AccountType.DEFAULT)
				.map((account) => {
					return {
						type: 'BUTTON_PROPS_TYPE',
						title: account.name,
						onSelect: () => {
							dispatch({
								type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT,
								transactionId: transaction.id,
								accountId: account.id,
							});
						},
					};
				}),
		},
		remove: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CLOSE_FILL,
			title: 'Remove',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE,
					transactionId: transaction.id,
				});
			},
		},
		decreaseOrder: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CHEVRON_UP_FILL,
			title: 'Decrease Order',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC,
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
					type: ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC,
					transactionId: transaction.id,
				});
			},
		},
	};
};
