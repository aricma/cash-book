import { IconType } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';
import { Account, AccountType } from '../state';
import { AccountProps } from '../props/accountsViewProps';
import { isPrecedent } from '../../../models/utils';
import { dispatch } from '../../../applicationState';
import { accountTypePrecedenceTable } from '../misc';

type Accounts = { [accountId: string]: Account };
export const toAccountsTableViewProps = (accounts: Accounts, showCreateModel: () => void): Array<AccountProps> => {
	return Object.values(accounts)
		.sort((a, b) => {
			return isPrecedent(accountTypePrecedenceTable)(a.type, b.type);
		})
		.map(
			(account): AccountProps => ({
				type: (() => {
					switch (account.type) {
						case AccountType.DEFAULT:
							return '';
						case AccountType.DIFFERENCE:
							return 'Difference';
						case AccountType.CASH_STATION:
							return 'Cashier';
					}
				})(),
				title: account.name,
				number: account.number,
				edit: {
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
			})
		);
};
