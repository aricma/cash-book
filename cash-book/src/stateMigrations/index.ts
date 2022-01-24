import { makeStateMigrations } from './makeStateMigrations';
import { toV1 } from './v1';
import {toV2} from './v2';
import {toV2_1} from './v2_1';

export const stateMigrations = makeStateMigrations([
	['init', toV1],
	['v1', toV2],
	['v2', toV2_1],
]);
