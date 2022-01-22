import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './misc/errorBoundary';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Router } from './router';
import { Menu } from './features/menu';
import { ResolveStateFromLocalStorage } from './features/resolveStateFromLocalStorage';
import { CreateBookEntry } from './features/createBookEntry';
import { Accounts } from './features/accounts';
import { Transactions } from './features/transactions';
import { Bookings } from './features/bookEntries';
import { store } from './applicationState';
import {
	ROUTES_CREATE_BOOK_ENTRY,
	ROUTES_ACCOUNTS,
	ROUTES_TRANSACTIONS,
	ROUTES_BOOK_ENTRIES,
	ROUTES_SETTINGS,
} from './variables/routes';
import reportWebVitals from './reportWebVitals';
import { Settings } from './features/settings';
import { DndProvider } from 'react-dnd';
import { dndBackend } from './misc/dnd';
import { GlobalStateWrapper } from './features/application';

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<ResolveStateFromLocalStorage>
					<GlobalStateWrapper>
						<DndProvider backend={dndBackend()}>
							<Router>
								<div className="relative bg-canvas w-screen min-h-screen mobile-save-padding">
									<div className="w-full p-4">
										<div className="pb-[70px]">
											<Routes>
												<Route path={ROUTES_CREATE_BOOK_ENTRY} element={<CreateBookEntry />} />
												<Route path={ROUTES_ACCOUNTS} element={<Accounts />} />
												<Route path={ROUTES_TRANSACTIONS} element={<Transactions />} />
												<Route path={ROUTES_BOOK_ENTRIES} element={<Bookings />} />
												<Route path={ROUTES_SETTINGS} element={<Settings />} />
											</Routes>
										</div>
									</div>
									<div className="fixed z-20 bottom-0 w-full h-[70px]">
										<Menu />
									</div>
									<div id="modals" className="fixed z-10 top-0" />
								</div>
							</Router>
						</DndProvider>
					</GlobalStateWrapper>
				</ResolveStateFromLocalStorage>
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
