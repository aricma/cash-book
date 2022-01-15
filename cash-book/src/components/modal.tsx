import React from 'react';
import ReactDOM from 'react-dom';
import { Transition } from '@headlessui/react';

export const AppearModal: React.FC<{ isVisible: boolean }> = (props) => {
	const container = document.getElementById('modals') || undefined;
	if (container === undefined) return null;
	return ReactDOM.createPortal(
		<Transition
			className="w-screen h-screen fixed indent-0"
			appear
			show={props.isVisible}
		>
			{props.children}
		</Transition>,
		container
	);
};

export const DialogContainer: React.FC = (props) => (
	<div className="w-full h-full px-2 flex items-center justify-center bg-gray-900/80">
		<div className="bg-canvas rounded-2xl border border-gray-700">
			{props.children}
		</div>
	</div>
);

export const SlideInModal: React.FC<{ isVisible: boolean }> = (props) => {
	const container = document.getElementById('modals') || undefined;
	if (container === undefined) return null;
	return ReactDOM.createPortal(
		<Transition
			as="div"
			className="w-screen h-screen fixed indent-0 pb-[70px]"
			show={props.isVisible}
			enter="transition ease-in-out duration-300 transform"
			enterFrom="translate-y-full"
			enterTo="translate-y-0"
			leave="transition ease-in-out duration-300 transform"
			leaveFrom="translate-y-0"
			leaveTo="translate-y-full"
		>
			{props.children}
		</Transition>,
		container
	);
};

export const OverlayContainer: React.FC = (props) => (
	<div className="w-screen h-screen px-1 pt-8">
		<div className="w-full h-full bg-canvas shadow-md rounded-t-2xl border border-gray-200 dark:border-gray-700">
			{props.children}
		</div>
	</div>
);
