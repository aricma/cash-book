import React from 'react';


export interface Props {
    left?: React.ReactNode;
    title: string;
    right?: React.ReactNode;
}

export const Header: React.FC<Props> = (props) => {
    return (
        <div className="grid grid-cols-[1fr_max-content_1fr] gap-2">
            {props.left ? <div>{props.left}</div> : <div/>}
            <h2 className="text-lg font-medium text-2 place-self-center">{props.title}</h2>
            {props.right ? <div>{props.right}</div> : <div/>}
        </div>
    );
};
