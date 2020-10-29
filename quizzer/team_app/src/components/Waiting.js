import React, { useState, useEffect } from 'react';
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { getWebSocket } from '../serverCommunication'


export default function Waiting(props) {
    let [name, setName] = useState(props.data.team.teamname)

    console.log(name);

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
         console.log(props.data);
        ws.send(JSON.stringify(msg))
        // console.log(getWebSocket());
    })

    console.log(name);

    // fetchNewState = () => {
    //     this.props.newState(this.state);
    //  }

    return (
        <div className="waiting_screen">
            <h1>{props.waitmessage}</h1>
            <InputField text="Edit your teamname" id="teamname" value={name} handleInput={e => setName(e.target.value)} />
            <Button text="Submit new teamname" color="btn-primary" clickEvent={() => {}} />
        </div>
    )

}
