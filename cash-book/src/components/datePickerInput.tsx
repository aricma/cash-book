import React from 'react';
import { DatePickerInputProps, IconType } from '../models/props';
import { DatePickerProps, DatePicker } from './datePicker';
import {
	getFirstDateOfTheMonth,
	getLastDateOfTheMonth,
	getFirstDateOfTheWeek,
	getLastDateOfTheWeek,
	getAllDatesInRange,
} from '../models/utils';
import { DateWithoutTime } from '../models/domain/date';

export const makeToDatePickerProps =
	(
		goToSelectedDate: () => void,
		prevYear: () => void,
		nextYear: () => void,
		prevMonth: () => void,
		nextMonth: () => void,
		onSelectDate: (date: Date) => void,
		dateIsDisabled: (date: Date) => boolean
	) =>
	(state: { selected?: Date; current: Date }): DatePickerProps => {
		const firstDateOfTheMonth = getFirstDateOfTheMonth(state.current);
		const lastDateOfTheMonth = getLastDateOfTheMonth(state.current);
		const firstDate = getFirstDateOfTheWeek(firstDateOfTheMonth);
		const lastDate = getLastDateOfTheWeek(lastDateOfTheMonth);
		return {
			year: {
				prev: {
					type: 'BUTTON_PROPS_TYPE',
					icon: IconType.CHEVRON_LEFT_FILL,
					title: 'Vorheriges Jahr',
					onSelect: prevYear,
				},
				current: {
					type: 'BUTTON_PROPS_TYPE',
					title: state.current.toLocaleDateString('de-DE', {
						year: 'numeric',
					}),
					onSelect: goToSelectedDate,
				},
				next: {
					type: 'BUTTON_PROPS_TYPE',
					icon: IconType.CHEVRON_RIGHT_FILL,
					title: 'Nächstes Jahr',
					onSelect: nextYear,
				},
			},
			month: {
				prev: {
					type: 'BUTTON_PROPS_TYPE',
					icon: IconType.CHEVRON_LEFT_FILL,
					title: 'Vorherigesr Monat',
					onSelect: prevMonth,
				},
				current: state.current.toLocaleDateString('de-DE', {
					month: 'long',
				}),
				next: {
					type: 'BUTTON_PROPS_TYPE',
					icon: IconType.CHEVRON_RIGHT_FILL,
					title: 'Nächster Monat',
					onSelect: nextMonth,
				},
			},
			weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
			days: getAllDatesInRange(firstDate, lastDate).map((date) => {
				if (date < firstDateOfTheMonth || date > lastDateOfTheMonth) {
					return {
						type: 'DISABLED_BUTTON_PROPS_TYPE',
						isClosed: false,
						title: date.toLocaleDateString('de-DE', {
							day: 'numeric',
						}),
					};
				} else if (dateIsDisabled(date)) {
					return {
						type: 'DISABLED_BUTTON_PROPS_TYPE',
						isClosed: true,
						title: date.toLocaleDateString('de-DE', {
							day: 'numeric',
						}),
					};
				} else {
					return {
						type: 'BUTTON_PROPS_TYPE',
						isSelected: state.selected?.toDateString() === date.toDateString(),
						title: date.toLocaleDateString('de-DE', {
							day: 'numeric',
						}),
						onSelect: () => {
							onSelectDate(date);
						},
					};
				}
			}),
		};
	};

export const DatePickerInput: React.FC<DatePickerInputProps> = (props) => {
	const [state, setState] = React.useState<Date>(DateWithoutTime.new());

	React.useEffect(() => {
		if (!!props.value) {
			setState(DateWithoutTime.fromString(props.value));
		}
		// eslint-disable-next-line
	}, []);

	const viewProps = makeToDatePickerProps(
		() => {
			setState(
				DateWithoutTime.fromString(props.value) || DateWithoutTime.new()
			);
		},
		() => {
			const currentYear = state.getFullYear();
			const nextYear = currentYear - 1;
			const newDate = DateWithoutTime.toWithoutTime(state);
			newDate.setFullYear(nextYear);
			setState(newDate);
		},
		() => {
			const currentYear = state.getFullYear();
			const nextYear = currentYear + 1;
			const newDate = DateWithoutTime.toWithoutTime(state);
			newDate.setFullYear(nextYear);
			setState(newDate);
		},
		() => {
			const currentMonth = state.getMonth();
			const nextMonth = currentMonth - 1;
			const newDate = DateWithoutTime.toWithoutTime(state);
			newDate.setMonth(nextMonth);
			setState(newDate);
		},
		() => {
			const currentMonth = state.getMonth();
			const nextMonth = currentMonth + 1;
			const newDate = DateWithoutTime.toWithoutTime(state);
			newDate.setMonth(nextMonth);
			setState(newDate);
		},
		(date) => {
			props.onChange(date.toISOString());
		},
		() => false
	)({
		selected: !!props.value
			? DateWithoutTime.fromString(props.value)
			: undefined,
		current: state,
	});
	return <DatePicker {...viewProps} />;
};
