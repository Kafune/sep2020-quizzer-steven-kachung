import React, { useState, useEffect } from 'react';
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { getWebSocket } from '../serverCommunication'


export default function Waiting(props) {
    const [name, setName] = useState(props.data.team.teamname)

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => {}
        ws.onopen = () => {}
        ws.onclose = () => {}
        ws.onmessage = msg => console.log(msg)
        const msg = {
            role: "client",
            room: props.data.quiz._id,
            request: "register_team"
         };
         console.log(props.data);
        ws.send(JSON.stringify(msg))
        // console.log(getWebSocket());
    })

    return (
        <div className="waiting_screen">
            <h1>{props.waitmessage}</h1>

            <InputField text="Edit your teamname" id="teamname" handleInput={(input) => setName(input)} />
            <Button text="Submit new teamname" color="btn-primary" clickEvent={() => {}} />

        </div>
    )

}
