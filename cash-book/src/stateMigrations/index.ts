import {makeStateMigrations} from './makeStateMigrations';
import {toV2, toV1} from './v1';


export const stateMigrations = makeStateMigrations([
    ["init", toV1],
    ['v1', toV2],
]);
