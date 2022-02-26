import { AccountsState } from '../state';

interface CreateAccountValidationMap {
	id?: string;
	type?: string;
	name?: string;
	number?: string;
}

export const validateCreateAccount = (state: AccountsState): CreateAccountValidationMap | undefined => {
	const name = !!state.create.name ? undefined : 'Name is missing!';
	const number = validateNumber(state);
	if (name === undefined && number === undefined) return undefined;
	return {
		id: undefined,
		type: undefined,
		name: name,
		number: number,
	};
};

const validateNumber = (state: AccountsState): string | undefined => {
	const number = state.create.number;
	if (number === undefined) return 'Number is missing!';
	if (!/^\d{4}$/.test(number)) return 'Account number is not a 4 digit number!';
	const match =
		Object.values(state.accounts)
			.filter((account) => {
				if (state.create.id) {
					return account.id !== state.create.id;
				} else {
					return true;
				}
			})
			.find((account) => account.number === number) || undefined;
	if (match !== undefined) return `Account is already taken by "${match.name}"!`;
	return undefined;
};
