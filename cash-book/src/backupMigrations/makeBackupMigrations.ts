import { Versions } from './versions';

export type Migration = (state: Versions) => Versions;
export const makeBackupMigrations =
	(migrations: Array<[fromVersion: string, f: Migration]>): Migration =>
	(state) => {
		return migrations.reduce((prevState, [version, migration]) => {
			if (prevState.__version__ === undefined && version === 'init') return migration(prevState);
			if (prevState.__version__ !== version) return prevState;
			return migration(prevState);
		}, state);
	};
