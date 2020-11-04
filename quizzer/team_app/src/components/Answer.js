import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Button from './childcomponents/Button';
import InputField from './childcomponents/InputField';
import QuestionInfo from './childcomponents/QuestionInfo';
import { getWebSocket, submitAnswer } from './../serverCommunication';


function Answer(props) {
    const appState = props.data;
    const [answer, setAnswer] = useState();
    const [hasAnswered, setHasAnswered] = useState(false);
    const [questionClosed, setQuestionClosed] = useState(false);

    const handleSaveAnswer = () => {
        console.log(answer)
        submitAnswer(appState.quiz._id, appState.team.teamname, answer)
            .then(() => {
                const msg = {
                    role: 'client',
                    teamname: appState.team.teamname,
                    quiz_id: appState.quiz._id,
                    answer: answer,
                    request: 'question_answered'
                }
                const msg2 = {
                    role: 'client',
                    quiz_id: appState.quiz._id,
                    request: 'new_answer'
                }
                const ws = getWebSocket();
                console.log(msg);
                ws.send(JSON.stringify(msg));
                ws.send(JSON.stringify(msg2));
            })
            .then(setHasAnswered(true))
            .catch(console.log("something went wrong"))
    }

    useEffect(() => {
        const ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => {
            switch(msg.data) {
            case 'question_closed':
            //hide input
                break;
                default: 
                    console.log("invalid msg")
            }
        }
    })

    return (
        <React.Fragment>
            <QuestionInfo currentQuestion={appState.quiz.currentQuestion} />
            <br></br>
            <div>
                <label htmlFor="answer" />
                Fill in your answer <input
                    type="text"
                    id="answer"
                    onChange={e => setAnswer(e.target.value)}
                />
                <label />
                <div className="dialogButtons">
                    <Button text="Submit answer" color="btn-primary" clickEvent={handleSaveAnswer} />
                </div>
                {hasAnswered &&
                    <div>
                        <h1>Waiting for other teams to answer the question...</h1>
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

export default withRouter(Answer)
