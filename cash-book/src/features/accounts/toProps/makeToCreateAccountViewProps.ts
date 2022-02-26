import { Dispatch } from '../../../applicationState';
import { CreateAccountViewProps } from '../props/createAccountViewProps';
import { validateCreateAccount } from './validation';
import { IconType, ButtonProps } from '../../../models/props';
import { AccountType, AccountsState } from '../state';
import { ApplicationActionType } from '../../../applicationState/actions';

export const makeToCreateAccountViewProps =
	(dispatch: Dispatch) =>
	(
		state: AccountsState,
		showValidation: boolean,
		validate: () => void,
		closeModal: () => void
	): CreateAccountViewProps => {
		const validationMap = validateCreateAccount(state);
		return {
			title: 'Create Account',
			close: {
				type: 'BUTTON_PROPS_TYPE',
				title: 'Close',
				icon: IconType.CLOSE_FILL,
				onSelect: closeModal,
			},
			type: {
				type: 'OPTIONS_INPUT_PROPS_TYPE',
				value: (() => {
					switch (state.create.type) {
						case AccountType.DEFAULT:
							return 'Default';
						case AccountType.CASH_STATION:
							return 'Cashier';
						case AccountType.DIFFERENCE:
							return 'Difference';
					}
				})(),
				placeholder: '',
				validation: showValidation ? validationMap?.type : undefined,
				options: [
					{ type: AccountType.DEFAULT, title: 'Default' },
					{ type: AccountType.CASH_STATION, title: 'Cashier' },
					{ type: AccountType.DIFFERENCE, title: 'Difference' },
				].map((option): ButtonProps => {
					return {
						type: 'BUTTON_PROPS_TYPE',
						title: option.title,
						onSelect: () => {
							dispatch({
								type: ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE,
								value: option.type,
							});
						},
					};
				}),
			},
			name: {
				type: 'TEXT_INPUT_PROPS_TYPE',
				value: state.create.name || '',
				label: 'Name',
				placeholder: 'e.g. Bank',
				validation: showValidation ? validationMap?.name : undefined,
				onChange: (value) =>
					dispatch({
						type: ApplicationActionType.ACCOUNTS_CREATE_SET_NAME,
						value: value,
					}),
			},
			number: {
				type: 'TEXT_INPUT_PROPS_TYPE',
				label: 'Number',
				value: state.create.number || '',
				placeholder: 'e.g. 1500',
				validation: showValidation ? validationMap?.number : undefined,
				onChange: (value) => {
					if (/\d*/.test(value)) {
						dispatch({
							type: ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER,
							value: value,
						});
					}
				},
			},
			cancel: {
				type: 'BUTTON_PROPS_TYPE',
				title: 'Cancel',
				onSelect: () => {
					closeModal();
					dispatch({
						type: ApplicationActionType.ACCOUNTS_CREATE_CANCEL,
					});
				},
			},
			submit:
				validationMap === undefined
					? {
							type: 'BUTTON_PROPS_TYPE',
							title: 'Submit',
							onSelect: () => {
								closeModal();
								dispatch({
									type: ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,
								});
							},
					  }
					: {
							type: 'BUTTON_PROPS_TYPE',
							title: 'Validate',
							onSelect: () => {
								validate();
							},
					  },
		};
	};
