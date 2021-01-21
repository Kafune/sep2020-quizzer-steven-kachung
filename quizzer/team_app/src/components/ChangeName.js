import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getWebSocket, changeTeamName } from '../serverCommunication'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';

function ChangeName(props) {
    const [name, setName] = useState(props.data.team.teamname)

    const changeTeam = () => {
        //TODO: CHANGE THIS IN THE WEBSOCKET
        changeTeamName(props.data.quiz._id, props.data.team.teamname, name)
            .then(() => {
                const msg = {
                    role: "client",
                    old_teamname: props.data.team.teamname,
                    new_teamname: name,
                    quiz_id: props.data.quiz._id,
                    request: "change_teamname"
                };
                const ws = getWebSocket();
                ws.send(JSON.stringify(msg))
            })
            .catch(() => {
                alert("something went wrong while trying to change name!")
            })

    }

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => {
            console.log(msg.data)
            switch (msg.data) {

                case 'start_round':
                    props.history.push('/quiz/waiting')
                    break;
                case 'team_deny':
                    console.log("hier")
                    props.history.push('/')
                    ws.close()
                    break;
            }
        }
    })
    return (
        <div>
            <h1>{props.waitmessage}</h1>
            <InputField text="Edit your teamname" id="teamname" value={name} handleInput={e => setName(e.target.value)} />
            <Button text="Submit new teamname" color="btn-primary" clickEvent={changeTeam} />
        </div>
    )
}

export default withRouter(ChangeName)