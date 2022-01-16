import {ApplicationState, dispatch} from '../../applicationState';
import {AccountType, Account} from './state';
import {ApplicationActionType} from '../../applicationState/actions';
import {BodyCellProps, IconType, ButtonProps, HeaderCellProps, DisabledButtonProps} from '../../models/props';
import {CreateAccountViewProps, AccountsViewProps} from './props';
import {isPrecedent} from '../../models/utils';
import {accountTypePrecedenceTable} from './misc';


export const toAccountsViewProps = (appState: ApplicationState, showCreateModel: () => void): AccountsViewProps => ({
    title: 'Accounts',
    create: {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.PLUS_FILL,
        title: 'Create',
        onSelect: showCreateModel,
    },
    export: {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.DOWNLOAD_FILL,
        title: 'Export',
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ACCOUNTS_EXPORT,
            });
        },
    },
    accounts: toAccountsTableViewProps(appState.accounts.accounts, showCreateModel),
});

export const toAccountsTableViewProps = (
    accounts: { [accountId: string]: Account },
    showCreateModel: () => void,
): Array<Array<HeaderCellProps | BodyCellProps | ButtonProps | DisabledButtonProps>> => [
    ['type', 'name', 'number', ''].map(
        (value): HeaderCellProps => ({
            type: 'HEADER_CELL_PROPS_TYPE',
            value: value,
        }),
    ),
    ...Object.values(accounts)
        .sort((a, b) => isPrecedent(accountTypePrecedenceTable)(a.type, b.type))
        .map((account): Array<BodyCellProps | ButtonProps | DisabledButtonProps> => {
            return [
                {
                    type: 'BODY_CELL_PROPS_TYPE',
                    value: (() => {
                        switch (account.type) {
                            case AccountType.DEFAULT:
                                return '';
                            case AccountType.DIFFERENCE:
                                return 'Difference';
                            case AccountType.CASH_STATION:
                                return 'Cashier';
                        }
                    })(),
                },
                {
                    type: 'BODY_CELL_PROPS_TYPE',
                    value: account.name,
                },
                {
                    type: 'BODY_CELL_PROPS_TYPE',
                    value: account.number,
                },
                {
                    type: 'BUTTON_PROPS_TYPE',
                    icon: IconType.PENCIL_ALT_FILL,
                    title: 'Edit',
                    onSelect: () => {
                        dispatch({
                            type: ApplicationActionType.ACCOUNTS_EDIT,
                            accountId: account.id,
                        });
                        showCreateModel();
                    },
                },
                // {
                // 	type: 'BUTTON_PROPS_TYPE',
                // 	icon: IconType.CLOSE_FILL,
                // 	title: 'Remove',
                // 	onSelect: () => {
                // 		dispatch({
                // 			type: ApplicationActionType.ACCOUNTS_REMOVE,
                // 			accountId: account.id,
                // 		})
                // 	}
                // }
            ];
        }),
];

export const toCreateAccountViewProps = (
    appState: ApplicationState,
    showValidation: boolean,
    validate: () => void,
    closeModal: () => void,
): CreateAccountViewProps => {
    const validationMap = validateCreateAccount(appState);
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
                switch (appState.accounts.create.type) {
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
                {type: AccountType.DEFAULT, title: 'Default'},
                {type: AccountType.CASH_STATION, title: 'Cashier'},
                {type: AccountType.DIFFERENCE, title: 'Difference'},
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
            value: appState.accounts.create.name || '',
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
            value: appState.accounts.create.number || '',
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

interface CreateAccountValidationMap {
    type?: string;
    name?: string;
    number?: string;
}

const validateCreateAccount = (appState: ApplicationState): CreateAccountValidationMap | undefined => {
    // const type =
    const name = !!appState.accounts.create.name ? undefined : 'Name is missing!';
    const number = validateNumber(appState);
    if (name === undefined && number === undefined) return undefined;
    return {
        type: undefined,
        name: name,
        number: number,
    };
};

const validateNumber = (appState: ApplicationState): string | undefined => {
    const number = appState.accounts.create.number;
    if (number === undefined) return 'Number is missing!';
    if (!/^\d{4}$/.test(number)) return 'Account number is not a 4 digit number!';
    const match = Object.values(appState.accounts.accounts).find((account) => account.number === number) || undefined;
    if (match !== undefined) return `Account is already taken by "${match.name}"!`;
    return undefined;
};
