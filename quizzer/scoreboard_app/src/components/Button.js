import React from 'react';

export default function Button(props) {
    return (
        <div className="dialogButtons">
            <button onClick={props.clickEvent} className={props.color}>{props.text}</button>
        </div>
    )
}