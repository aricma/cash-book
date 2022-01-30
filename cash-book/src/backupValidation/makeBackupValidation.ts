export type ValidationMap = { [key: string]: string | null };
export type Validation = (data: any) => ValidationMap | null;
export const makeBackupValidation =
	(validations: Array<Validation>): Validation =>
	(state) => {
		return validations.reduce((map: ValidationMap | null, validation) => {
			const subMap = validation(state);
			if (map === null && subMap === null) return null;
			return {
				...(map || {}),
				...(validation(state) || {}),
			};
		}, null);
	};
