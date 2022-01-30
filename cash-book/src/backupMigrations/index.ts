import { makeBackupMigrations } from './makeBackupMigrations';
import { toV1 } from './v1';
import { toV2 } from './v2';
import { toV2_1 } from './v2_1';
import {toV3} from './v3';

export const latestVersion = 'v3'

export const migrateBackup = makeBackupMigrations([
	['init', toV1],
	['v1', toV2],
	['v2', toV2_1],
	['v2.1', toV3],
]);
