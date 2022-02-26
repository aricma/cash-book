import { Validation } from './makeBackupValidation';
import { latestVersion } from '../backupMigrations';
import { WRONG_VERSION_MESSAGE } from './messages';

export const validateVersion: Validation = (data) => {
	return data['__version__'] === latestVersion
		? null
		: {
				version: WRONG_VERSION_MESSAGE,
		  };
};
