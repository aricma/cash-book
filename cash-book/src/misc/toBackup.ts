import { ApplicationState } from '../applicationState';
import { LatestVersion, latestVersion } from '../backupMigrations';

export const toBackup = (appState: ApplicationState): LatestVersion => ({
	__version__: latestVersion,
	accounts: appState.accounts.accounts,
	templates: appState.transactions.templates,
	transactions: appState.transactions.transactions,
	bookEntries: appState.bookEntries.templates,
});
