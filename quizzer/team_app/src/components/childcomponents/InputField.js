import React from 'react';

export default function InputField(props) {
    return (
        <React.Fragment>
            <label htmlFor="password"/>
               {props.text} <input
                type ="text"
                id = {props.inputId}
                onChange={props.handleInput}
             /> 
            <label/>
        </React.Fragment>
    );
}

