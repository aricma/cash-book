import React from 'react';
import {Account, AccountType} from '../accounts/state';
import {toImportAccountsViewProps} from './toProps';
import {ImportAccountsView} from './views';


export const ImportAccounts: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const [accounts, setAccounts] = React.useState<{ [accountId: string]: Account }>({});
    const viewProps = toImportAccountsViewProps({
        modal: {
            isVisible: showModal,
            close: () => setShowModal(false),
        },
        accounts: accounts,
        file: {
            isLoading: loading,
            value: file,
            set: (file: File) => {
                setLoading(true);
                setFile(file);
                file.text().then((text) => {
                    const rowsWithoutHeadline = text.split('\n').slice(1);
                    const accounts = rowsWithoutHeadline.reduce((accounts, row) => {
                        const [name, type, number] = row.split(';').map((cell) => cell.slice(1, -1));
                        const account: Account = {
                            id: number,
                            type: type as AccountType,
                            name: name,
                        }
                        return {
                            ...accounts,
                            [number]: account,
                        }
                    }, {});
                    setAccounts(accounts);
                    setShowModal(true);
                    setLoading(false);
                });
            },
            close: () => setShowModal(false),
        },
    });
    return (
        <ImportAccountsView {...viewProps} />
    );
}
