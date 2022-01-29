import React from 'react';
import {dispatch} from '../../applicationState';
import {ApplicationActionType} from '../../applicationState/actions';
import {ROUTES_CREATE_BOOK_ENTRY} from '../../variables/routes';
import {Icon} from '../../components/icons';
import {IconType} from '../../models/props';


export const Home: React.FC = () => {
    React.useEffect(() => {
        setTimeout(() => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_CREATE_BOOK_ENTRY,
            });
        }, 1500);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-blue-100 flex items-center justify-center">
            <h1 className="text-blue-600 font-extrabold text-4xl flex items-center">
                <span>cash</span>
                <Icon type={IconType.CASH_BOOK} className="w-[4rem]" />
                <span>Book</span>
            </h1>
        </div>
    );
}
