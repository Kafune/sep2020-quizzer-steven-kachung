import React, { useState, useEffect } from 'react';
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { getWebSocket } from '../serverCommunication'



export default function Waiting(props) {
    const initialState = {
        ...props.data
    }
    let [name, setName] = useState(initialState.team.teamname)

    console.log(initialState.team.teamname);
    console.log(initialState)

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => {}
        ws.onopen = () => {}
        ws.onclose = () => {}
        ws.onmessage = msg => console.log(msg.data == 'team_deny')
        const msg = {
            role: "client",
            request: "register_team"
         };
        ws.send(JSON.stringify(msg))
        // console.log(getWebSocket());
    })



    return (
        <div className="waiting_screen">
            <h1>{props.waitmessage}</h1>
            <InputField text="Edit your teamname" id="teamname" value={name} handleInput={e => setName(...initialState, e.target.value)} />
            <Button text="Submit new teamname" color="btn-primary" clickEvent={props.newTeamName} />
        </div>
    )

}
