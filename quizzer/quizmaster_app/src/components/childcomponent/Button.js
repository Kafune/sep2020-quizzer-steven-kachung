import React from 'react';

export default function Button(props) {
    return (
            <button onClick={props.clickEvent} className={props.color}>{props.text}</button>
    )
}