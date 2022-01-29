import * as Solid from '@heroicons/react/solid';
import * as Outline from '@heroicons/react/outline';
import React from 'react';
import { WithClasses, WithIconType, IconType } from '../../models/props';
import { Cashier } from './cashier';
import { Spinner } from './spinner';
import {CashBook} from './cashBook';

export const Icon: React.FC<WithIconType & WithClasses> = (props) => {
	switch (props.type) {
		case IconType.PLUS_FILL:
			return <Solid.PlusIcon {...props} />;
		case IconType.COLLECTION_FILL:
			return <Solid.CollectionIcon {...props} />;
		case IconType.CLIPBOARD_CHECK_FILL:
			return <Solid.ClipboardCheckIcon {...props} />;
		case IconType.CHEVRON_UP_FILL:
			return <Solid.ChevronUpIcon {...props} />;
		case IconType.CHEVRON_RIGHT_FILL:
			return <Solid.ChevronRightIcon {...props} />;
		case IconType.CHEVRON_DOWN_FILL:
			return <Solid.ChevronDownIcon {...props} />;
		case IconType.CHEVRON_LEFT_FILL:
			return <Solid.ChevronLeftIcon {...props} />;
		case IconType.ARROW_NARROW_LEFT_FILL:
			return <Solid.ArrowNarrowLeftIcon {...props} />;
		case IconType.ARROW_NARROW_RIGHT_FILL:
			return <Solid.ArrowNarrowRightIcon {...props} />;
		case IconType.ARROW_NARROW_RIGHT_STROKE:
			return <Outline.ArrowNarrowRightIcon {...props} />;
		case IconType.ARROW_NARROW_LEFT_STROKE:
			return <Outline.ArrowNarrowLeftIcon {...props} />;
		case IconType.TRENDING_UP_FILL:
			return <Outline.TrendingUpIcon {...props} />;
		case IconType.TRENDING_DOWN_FILL:
			return <Outline.TrendingDownIcon {...props} />;
		case IconType.CLOSE_FILL:
			return <Solid.XIcon {...props} />;
		case IconType.BOOK_OPEN_FILL:
			return <Solid.BookOpenIcon {...props} />;
		case IconType.BOOK_OPEN_STROKE:
			return <Outline.BookOpenIcon {...props} />;
		case IconType.CASHIER:
			return <Cashier {...props} />;
		case IconType.UPLOAD_FILL:
			return <Solid.UploadIcon {...props} />;
		case IconType.DOWNLOAD_FILL:
			return <Solid.DownloadIcon {...props} />;
		case IconType.PENCIL_ALT_FILL:
			return <Solid.PencilAltIcon {...props} />;
		case IconType.COG_FILL:
			return <Solid.CogIcon {...props} />;
		case IconType.REFRESH_FILL:
			return <Solid.RefreshIcon {...props} />;
		case IconType.AT_SYMBOL_FILL:
			return <Solid.AtSymbolIcon {...props} />;
		case IconType.CHART_BAR_FILL:
			return <Solid.ChartBarIcon {...props} />;
		case IconType.SUPPORT_FILL:
			return <Solid.SupportIcon {...props} />;
		case IconType.SUPPORT_STROKE:
			return <Outline.SupportIcon {...props} />;
		case IconType.SPINNER:
			return <Spinner {...props} />;
		case IconType.CASH_BOOK:
			return <CashBook {...props} />;
		default:
			return (
				<svg {...props} viewBox="0 0 1 1" fill="currentColor" stroke="none">
					<rect x="0" y="0" width="1" height="1" rx=".1" />
				</svg>
			);
	}
};
