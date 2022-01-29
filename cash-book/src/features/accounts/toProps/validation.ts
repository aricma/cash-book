import {ApplicationState} from '../../../applicationState';


interface CreateAccountValidationMap {
    id?: string;
    type?: string;
    name?: string;
    number?: string;
}

export const validateCreateAccount = (appState: ApplicationState): CreateAccountValidationMap | undefined => {
    const name = !!appState.accounts.create.name ? undefined : 'Name is missing!';
    const number = validateNumber(appState);
    if (name === undefined && number === undefined) return undefined;
    return {
        id: undefined,
        type: undefined,
        name: name,
        number: number,
    };
};

const validateNumber = (appState: ApplicationState): string | undefined => {
    const number = appState.accounts.create.number;
    if (number === undefined) return 'Number is missing!';
    if (!/^\d{4}$/.test(number)) return 'Account number is not a 4 digit number!';
    const match = Object.values(appState.accounts.accounts)
        .filter((account) => {
            if (appState.accounts.create.id) {
                return account.id !== appState.accounts.create.id;
            } else {
                return true;
            }
        })
        .find((account) => account.number === number) || undefined;
    if (match !== undefined) return `Account is already taken by "${match.name}"!`;
    return undefined;
};
