import {
	ConnectDragSource,
	ConnectDropTarget,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor,
	XYCoord,
	DragSource,
	DropTarget,
} from 'react-dnd';
import React from 'react';
import { TransactionViewProps } from './props';

interface TargetProps {
	index: number;
	move: (fromIndex: number, toIndex: number) => void;
}

interface TargetInstance {
	getNode(): HTMLDivElement | null;
}

export type RefTargetProps = TargetProps & {
	isDragging: boolean;
	connectDragSource: ConnectDragSource;
	connectDropTarget: ConnectDropTarget;
};

const RefTarget = React.forwardRef<HTMLDivElement, RefTargetProps>((props, ref) => {
	const elementRef = React.useRef(null);
	props.connectDragSource(elementRef);
	props.connectDropTarget(elementRef);

	React.useImperativeHandle<any, TargetInstance>(ref, () => ({
		getNode: () => elementRef.current,
	}));
	return (
		<div ref={elementRef} className="">
			{props.isDragging ? (
				<div className="cursor-grabbing rounded-md border-2 border-blue-500">
					<div className="opacity-0">{props.children}</div>
				</div>
			) : (
				<div className="cursor-grab border-2 border-transparent">{props.children}</div>
			)}
		</div>
	);
});

export const Target = DropTarget(
	'transaction',
	{
		hover(props: TransactionViewProps & TargetProps, monitor: DropTargetMonitor, component: TargetInstance) {
			if (!component) {
				return null;
			}
			// node = HTML Div element from imperative API
			const node = component.getNode();
			if (!node) {
				return null;
			}

			const dragIndex = monitor.getItem<TargetProps>().index;
			const hoverIndex = props.index;

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = node.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			props.move(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem<TargetProps>().index = hoverIndex;
		},
	},
	(connect: DropTargetConnector) => ({
		connectDropTarget: connect.dropTarget(),
	})
)(
	DragSource(
		'transaction',
		{
			beginDrag: (props: TargetProps) => ({
				index: props.index,
			}),
		},
		(connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		})
	)(RefTarget)
);
