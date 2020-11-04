import React from 'react';

export default function InputField(props) {
    return (
        <React.Fragment>
            <label htmlFor="password"/>
               {props.text} 
               <input
                type ="text"
                id = {props.id}
                onChange={props.handleInput}
                value={props.value}
                required
             /> 
            <label/>
        </React.Fragment>
    );
}

