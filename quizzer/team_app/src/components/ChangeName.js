import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getWebSocket, changeTeamName} from '../serverCommunication'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';

function ChangeName(props) {
    const [name, setName] = useState(props.data.team.teamname)

    const changeTeam = () => {
        changeTeamName(props.data.quiz._id, props.data.team.teamname, name)
            .then(() => {
                const msg = {
                    role: "client",
                    teamname: name,
                    quiz_id: props.data.quiz._id,
                    request: "change_teamname"
                };
                const ws = getWebSocket();
                ws.send(JSON.stringify(msg))
                console.log(getWebSocket());
            })

    }

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => { 
            switch (msg.data) {
                case 'team_deny':
                    this.props.history.push('/')
                    break;
                case 'start_round':
                        props.history.push('/quiz/waiting')
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