import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { openWebSocket, getWebSocket, startQuiz } from './../ServerCommunication';

import Button from './childcomponent/Button';

function Home(props) {
    const createNewQuiz = () => {
        let ws = openWebSocket();
        ws.onerror = () => { console.log('error') };
        ws.onopen = () => { console.log('connected') };
        ws.onclose = () => { };
        ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg.data)

        startQuiz().then(json => {
            props.newState(() => ({
                quiz: {
                    ...props.appState.quiz,
                    _id: json._id,
                    password: json.password,
                    round: {
                        ...props.appState.quiz.round,
                        number: json.round.number
                    }
                }
            }), () => console.log(json));
        }).then(() => {
            const msg = {
                role: 'quizmaster',
                quiz_id: props.appState.quiz._id,
                request: 'new_quiz'
            }
            const ws = getWebSocket();
            ws.send(JSON.stringify(msg));

        })
            .then(() => {
                props.history.push('/quiz/approve-teams')
            })
    }
    return (
        <>
            <h2>Homepage</h2>
            <Button text="Start new quiz night" color="btn-success" clickEvent={createNewQuiz} >Start new quiz</Button>
        </>
    )
}

export default withRouter(Home);
