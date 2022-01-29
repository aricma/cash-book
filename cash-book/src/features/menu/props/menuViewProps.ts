import {ButtonProps} from '../../../models/props';


export interface MenuViewProps {
    pages: Array<ButtonProps & { isCenter?: boolean }>;
}
