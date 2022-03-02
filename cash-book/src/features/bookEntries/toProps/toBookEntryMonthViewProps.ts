import { ApplicationState } from '../../../applicationState';
import { BookEntry } from '../state';
import { BookEntryMonthViewProps } from '../props';
import { IconType } from '../../../models/props';
import { ApplicationActionType, ExportFileType, ExportPayloadType } from '../../../applicationState/actions';
import { dispatch } from '../../../applicationState/store';
import { toBookEntryDayViewProps } from './toBookEntryDayViewProps';
import { DateWithoutTime } from '../../../models/dateWithoutTime';

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
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'month',
						date: bookEntry.date,
					},
				});
			},
		},
		entries: [toBookEntryDayViewProps(appState, bookEntry)],
	};
};
