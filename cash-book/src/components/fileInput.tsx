import React, { ChangeEvent } from 'react';
import { FileInputProps } from '../models/props';

export type Props = FileInputProps & {
	accept?: string;
	button: React.FC<{ isLoading: boolean; onSelect: () => void }>;
};
export const FileInput: React.FC<Props> = (props) => {
	const ref = React.useRef<HTMLInputElement>(null);
	const [loading, setLoading] = React.useState(false);
	return (
		<>
			<input
				ref={ref}
				type="file"
				className="hidden"
				accept={props.accept}
				value=""
				onChange={(e) => {
					if (e.target.files === null) return;
					const file = e.target.files[0];
					props.onChange(file);
					setLoading(false);
				}}
			/>
			<props.button
				isLoading={loading}
				onSelect={() => {
					setLoading(true);
					if (ref.current !== null) {
						ref.current.click();
					}
				}}
			/>
		</>
	);
};
