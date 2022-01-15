import React from 'react';
import { TextInputProps } from '../models/props';

export type Props = TextInputProps & {
	autoFocus?: boolean;
	pattern?: string;
};
export const TextInput: React.FC<Props> = (props) => {
	return (
		<div className="w-full space-y-2">
			<div className="input-group input-lg py-1 px-4">
				<div className="relative w-full flex items-center justify-center">
					<input
						type="text"
						className={'peer w-full text-1 pt-4 placeholder:text-transparent focus:placeholder:text-3'}
						autoFocus={props.autoFocus}
						pattern={props.pattern}
						value={props.value}
						placeholder={props.label ? props.placeholder : ''}
						onChange={(e) => props.onChange(e.target.value)}
					/>
					{props.value.length === 0 ? (
						<label className="transition-all ease-out pointer-events-none absolute top-0 left-0 pl-2 origin-left translate-x-0 translate-y-2 text-2 peer-focus:pl-0 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium">
							{props.label || props.placeholder}
						</label>
					) : (
						<label className="transition-all ease-out pointer-events-none absolute top-0 left-0 origin-left text-2 text-xs font-medium">
							{props.label || props.placeholder}
						</label>
					)}
				</div>
			</div>
			{props.validation && <span className="ml-2 text-sm text-danger">{props.validation}</span>}
		</div>
	);
};
