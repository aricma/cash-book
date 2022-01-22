// import {TouchBackend} from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const dndBackend = () => {
	return HTML5Backend; // isTouchDevice() ? TouchBackend : HTML5Backend;
};

// const isTouchDevice = () => {
//     // @ts-ignore
//     return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
// }
