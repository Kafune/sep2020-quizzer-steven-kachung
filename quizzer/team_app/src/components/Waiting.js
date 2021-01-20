import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom'
import { getWebSocket, getCurrentQuestion } from '../serverCommunication'




function Waiting(props) {
    // const [name, setName] = useState(props.data.team.teamname)
    // const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => {
            switch (msg.data) {
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
            <h1>Waiting for quizmaster to choose a question...</h1>
        </div>
    )

}

export default withRouter(Waiting)