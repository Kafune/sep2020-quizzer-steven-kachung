import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { getWebSocket, changeTeamName, getCurrentQuestion } from '../serverCommunication'




function Waiting(props) {
    const [name, setName] = useState(props.data.team.teamname)
    const [quizStarted, setQuizStarted] = useState(false);

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
                    setQuizStarted(true)
                    break;
                case 'select_question':
                    //fetch
                    console.log(props.data.quiz._id)
                    getCurrentQuestion(props.data.quiz._id)
                    //setstate
                    .then(res => {
                        console.log(res)
                        
                        console.log(res.questions[res.questions.length-1].question)
                        props.newState({
                            quiz: {
                                ...props.data.quiz,
                                currentQuestion: res.questions[res.questions.length-1].question
                            }
                        })
                        
                    })
                    .then(props.history.push('/quiz/question'))
                    .catch(() => console.log("Something went wrong"))
                    break;
            }
        }
    })

    return (
        <div className="waiting_screen">
            {(!quizStarted) ?
                <div>
                    <h1>{props.waitmessage}</h1>
                    <InputField text="Edit your teamname" id="teamname" value={name} handleInput={e => setName(e.target.value)} />
                    <Button text="Submit new teamname" color="btn-primary" clickEvent={changeTeam} />
                </div>
            :<h1>Waiting for quizmaster to choose a question...</h1>}
        </div>
    )

}

export default withRouter(Waiting)