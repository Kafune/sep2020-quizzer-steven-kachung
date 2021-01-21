import React, { useEffect } from 'react';
import {withRouter} from 'react-router-dom'
import { getWebSocket, getTeamInfo } from '../serverCommunication'




function ResultScreen(props) {
    const appState = props.data;

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => { 
            switch(msg.data) {
                case 'start_round':
                    props.newState({
                        quiz: {
                            ...props.data.quiz,
                            questionNumber: 1,
                            round: props.data.quiz.round + 1
                        },
                        team: {
                            ...props.data.team,
                            question_answered: 0
                        }
                    })
                    props.history.push('/quiz/waiting')
                    break;
                case 'end_quiz':
                    props.history.push('/')
                    break;
            }
         }
    })

    return (
        <div>
            <h1>Round has ended</h1>
            <p>You have {appState.team.score} points!</p>
            <p>Waiting for the quizmaster to decide...</p>
        </div>
    )
}

export default withRouter(ResultScreen)
