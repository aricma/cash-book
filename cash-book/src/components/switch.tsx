import React from 'react'
import {BooleanInputProps} from '../models/props';
import * as Headless from '@headlessui/react'

export const Switch: React.FC<BooleanInputProps> = (props) => {
    return (
        <Headless.Switch
            checked={props.value}
            onChange={props.onChange}
            className={`${
                props.value ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11`}
        >
            <span className="sr-only">{props.title || ""}</span>
            <span
                className={`${
                    props.value ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full`}
            />
        </Headless.Switch>
    )
}
