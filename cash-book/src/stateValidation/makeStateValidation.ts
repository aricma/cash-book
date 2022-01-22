import {ApplicationState} from '../applicationState';


export type ValidationMap = { [key: string]: string | null };
export type Validation = (state: ApplicationState) => ValidationMap | null;
export const makeStateValidation = (validations: Array<Validation>): Validation => (state) => {
    return validations.reduce((map: ValidationMap | null, validation) => {
        const subMap = validation(state);
        if (map === null && subMap === null) return null;
        return {
            ...(map || {}),
            ...(validation(state) || {}),
        };
    }, null);
};
