import { ApplicationState } from '../../../applicationState';
import { DataTransactionsViewProps, TransactionsViewType } from '../props/transactionsViewProps';
import { IconType } from '../../../models/props';
import { toTemplateViewProps } from './toTemplateViewProps';

export const toDataTransactionsViewProps = (
	appState: ApplicationState,
	openModal: () => void
): DataTransactionsViewProps => ({
	type: TransactionsViewType.DATA,
	title: 'Transactions',
	create: {
		type: 'BUTTON_PROPS_TYPE',
		title: 'Create',
		icon: IconType.PLUS_FILL,
		onSelect: openModal,
	},
	templates: Object.values(appState.transactions.templates).map((template) =>
		toTemplateViewProps(appState, template, openModal)
	),
});
