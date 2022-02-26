import { Versions } from './versions';

export type Migration = (state: Versions) => Versions;
export const makeBackupMigrations =
	(migrations: Array<[fromVersion: string | undefined, f: Migration]>): Migration =>
	(state) => {
		return migrations.reduce((prevState, [version, migration]) => {
			if (prevState.__version__ === version) {
				return migration(prevState);
			} else {
				return prevState;
			}
		}, state);
	};
