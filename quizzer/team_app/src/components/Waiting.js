import React, { useState, useEffect, useContext } from 'react';
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { getWebSocket } from '../serverCommunication'




export default function Waiting(props) {
    // const initialState = {
    //     ...props.data,
    //     quizStarted: false,
    //     isLoading: false
    // }
    // const [data, setData] = useState({...props.data});
    const [name, setName] = useState(props.data.team.teamname)

    const changeTeam = () => {
        const msg = {
            role: "client",
            teamname: name,
            quiz_id: props.data.quiz._id,
            request: "change_teamname" //CHANGE NAME
         };
         const ws = getWebSocket();
        ws.send(JSON.stringify(msg))
        console.log(getWebSocket());
    }

    console.log(name)

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => {}
        ws.onopen = () => {}
        ws.onclose = () => {}
        ws.onmessage = msg => console.log(msg.data == 'team_deny')

    })

    return (
        <div className="waiting_screen">
            {!props.data.quizStarted
            ? <h1>{props.waitmessage}</h1>
            : <h1>Quiz started</h1>
        }
            <InputField text="Edit your teamname" id="teamname" value={name} handleInput={e => setName(e.target.value)} />
            <Button text="Submit new teamname" color="btn-primary" clickEvent={changeTeam} />
        </div>
    )

}
