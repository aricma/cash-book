import { ApplicationState, dispatch } from '../../../applicationState';
import { Template } from '../state';
import { TemplateViewProps } from '../props/transactionsViewProps';
import { IconType } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';
import { compact } from '../../../models/utils';
import { toTransactionViewProps } from './toTransactionViewProps';

export const toTemplateViewProps = (
	appState: ApplicationState,
	template: Template,
	openModal: () => void
): TemplateViewProps => ({
	title: template.name,
	edit: {
		type: 'BUTTON_PROPS_TYPE',
		icon: IconType.PENCIL_ALT_FILL,
		title: 'Edit Template',
		onSelect: () => {
			dispatch({
				type: ApplicationActionType.TRANSACTIONS_EDIT,
				templateId: template.id,
			});
			openModal();
		},
	},
	transactions: compact(
		Object.values(template.transactions).map((transactionId) => {
			const transaction = appState.transactions.transactions[transactionId];
			return toTransactionViewProps(appState, template, transaction);
		})
	),
});
