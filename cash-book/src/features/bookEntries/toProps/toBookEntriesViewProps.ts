import { BookEntriesViewProps } from '../props';
import { ApplicationState } from '../../../applicationState';
import { toEntriesBookEntriesViewProps } from './toEntriesBookEntriesViewProps';
import { toNoTemplateBookEntriesViewProps } from './toNoTemplateBookEntriesViewProps';
import { toNoTemplatesBookEntriesViewProps } from './toNoTemplatesBookEntriesViewProps';
import { toSkeletonBookEntriesViewProps } from './toSkeletonBookEntriesViewProps';

export const toBookEntriesViewProps = (appState: ApplicationState): BookEntriesViewProps => {
	const hasNoTemplates = Object.keys(appState.bookEntries.templates).length === 0;
	const templateId = appState.bookEntries.selectedTemplateId || '';
	const hasNoSelectedTemplate = templateId === '';
	const hasNoEntries = Object.keys(appState.bookEntries.templates[templateId] || {}).length === 0;
	switch (true) {
		case hasNoTemplates:
			return toNoTemplatesBookEntriesViewProps();
		case hasNoSelectedTemplate:
			return toNoTemplateBookEntriesViewProps(appState);
		case hasNoEntries:
			return toSkeletonBookEntriesViewProps(appState);
		default:
			return toEntriesBookEntriesViewProps(appState);
	}
};
