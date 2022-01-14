import {ApplicationState, dispatch} from '../../applicationState';
import {AccountType} from './state';
import {ApplicationActionType} from '../../applicationState/actions';
import {BodyCellProps, IconType, ButtonProps} from '../../models/props';
import {CreateAccountViewProps, AccountsViewProps} from './props';
import {PrecedenceTable, isPrecedent} from '../../models/utils';


const accountTypePrecedenceTable: PrecedenceTable<AccountType, AccountType> = [
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

export const toAccountsViewProps = (appState: ApplicationState, showCreateModel: () => void): AccountsViewProps => ({
    title: 'Accounts',
    create: {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.PLUS_FILL,
        title: 'Create',
        onSelect: showCreateModel,
    },
    accounts: [
        ['type', 'name', 'number'].map((value) => ({
            type: 'HEADER_CELL_PROPS_TYPE',
            value: value,
        })),
        ...Object.values(appState.accounts.accounts).sort((a, b) => {
            return isPrecedent(accountTypePrecedenceTable)(a.type, b.type);
        }).map((account): Array<BodyCellProps> => {
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
                        value: account.id,
                    },
                ];
            }),
    ],
});

export const toCreateAccountViewProps = (appState: ApplicationState, closeCreateModel: () => void): CreateAccountViewProps => {
    const validationMap = validateCreateAccount(appState);
    return ({
        title: 'Create Account',
        close: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Close',
            icon: IconType.CLOSE_FILL,
            onSelect: closeCreateModel,
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
            validation: validationMap?.type,
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
            validation: validationMap?.name,
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
            validation: validationMap?.number,
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
                closeCreateModel();
                dispatch({
                    type: ApplicationActionType.ACCOUNTS_CREATE_CANCEL,
                });
            },
        },
        submit: validationMap === undefined ? {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Submit',
            onSelect: () => {
                closeCreateModel();
                dispatch({
                    type: ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,
                });
            },
        } : {
            type: 'DISABLED_BUTTON_PROPS_TYPE',
            title: 'Validate',
        },
    });
}

interface CreateAccountValidationMap {
    type?: string;
    name?: string;
    number?: string;
}
const validateCreateAccount = (appState: ApplicationState): CreateAccountValidationMap | undefined => {
    // const type =
    const name = !!appState.accounts.create.name ? undefined : "Name is missing!";
    const number = !!appState.accounts.create.number ? undefined : "Number is missing!";
    if (name === undefined && number === undefined) return undefined;
    return {
        type: undefined,
        name: name,
        number: number,
    }
}
