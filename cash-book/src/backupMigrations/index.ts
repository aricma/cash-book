import { makeBackupMigrations } from './makeBackupMigrations';
import { toV1 } from './v1';
import { toV2 } from './v2';
import { toV2_1 } from './v2_1';
import { toV3 } from './v3';
import { toV3_1, V3_1 } from './v3_1';

export type LatestVersion = V3_1;
export const latestVersion = 'v3.1';

export const migrateBackup = makeBackupMigrations([
	['init', toV1],
	['v1', toV2],
	['v2', toV2_1],
	['v2.1', toV3],
	['v3', toV3_1],
]);
