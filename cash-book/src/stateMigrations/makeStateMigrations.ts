import {States} from './states';


export type Migration = (state: States) => States;
export const makeStateMigrations = (migrations: Array<[fromVersion: string, f: Migration]>): Migration => (state) => {
    return migrations.reduce((prevState, [version, migration]) => {
        if (prevState.__version__ === undefined && version === "init") return migration(prevState);
        if (prevState.__version__ !== version) return prevState;
        return migration(prevState);
    }, state);
};
