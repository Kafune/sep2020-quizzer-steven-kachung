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
    const [isLoading, setIsLoading] = useState(props.data.isLoading)

    console.log(props.data);
    console.log(name)

    useEffect(() => {
        // setIsLoading(true);

        const ws = getWebSocket();
        ws.onerror = () => {}
        ws.onopen = () => {}
        ws.onclose = () => {}
        ws.onmessage = msg => console.log(msg.data == 'team_deny')
        const msg = {
            role: "client",
            teamname: name,
            quiz_id: props.data.quiz._id,
            request: "register_team" //CHANGE NAME
         };
        ws.send(JSON.stringify(msg))
        // console.log(getWebSocket());
    })

    if(isLoading) {
        return <h1>Loading</h1>
    }

    return (
        <div className="waiting_screen">
            {!props.data.quizStarted
            ? <h1>{props.waitmessage}</h1>
            : <h1>Quiz started</h1>
        }
            <InputField text="Edit your teamname" id="teamname" value={name} handleInput={e => setName(e.target.value)} />
            <Button text="Submit new teamname" color="btn-primary" clickEvent={props.newTeamName} />
        </div>
    )

}
