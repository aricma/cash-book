import { ApplicationState, dispatch } from '../../../applicationState';
import { BookEntry } from '../state';
import { BookEntryMonthViewProps } from '../props';
import { DateWithoutTime } from '../../../models/domain/date';
import { IconType } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';
import { toBookEntryDayViewProps } from './toBookEntryDayViewProps';

export const toBookEntryMonthViewProps = (
	appState: ApplicationState,
	bookEntry: BookEntry
): BookEntryMonthViewProps => {
	return {
		date: DateWithoutTime.fromString(bookEntry.date).toLocaleDateString('de-DE', {
			year: 'numeric',
			month: 'long',
		}),
		export: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.DOWNLOAD_FILL,
			title: 'Export',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.APPLICATION_EXPORT,
					exportPayloadType: 'EXPORT_PAYLOAD_TYPE/BOOK_ENTRIES',
					dataType: 'book-entries',
					fileType: 'datev',
					range: 'month',
					date: bookEntry.date,
				});
			},
		},
		entries: [toBookEntryDayViewProps(appState, bookEntry)],
	};
};
