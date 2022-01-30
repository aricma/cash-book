import {Validation} from './makeBackupValidation';
import {latestVersion} from '../backupMigrations';


export const validateVersion: Validation = (data) => {
    return data["__version__"] === latestVersion ? null : {
        version: "Backup has not latest version!",
    };
}
