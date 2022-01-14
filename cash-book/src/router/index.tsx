import { history } from './history';
import { MakeRouterWithHistory } from './routerWithCustomHistory';

export * from './history';
export const Router = MakeRouterWithHistory(history);
