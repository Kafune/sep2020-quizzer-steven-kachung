import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Button from './childcomponents/Button';
import QuestionInfo from './childcomponents/QuestionInfo';
import { getWebSocket, submitAnswer, getCurrentQuestion } from './../serverCommunication';


function Answer(props) {
    const appState = props.data;
    const [answer, setAnswer] = useState();
    const [hasAnswered, setHasAnswered] = useState(false);
    const [questionClosed, setQuestionClosed] = useState(false);
    const [questionStatus, setQuestionStatus] = useState(0);

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
            console.log(questionStatus)
            switch (msg.data) {
                case 'closed_question':
                    setQuestionClosed(true);
                    break;
                case 'question_approved':
                    setQuestionStatus(1);
                    console.log(questionStatus);
                    break;
                case 'question_denied':
                    setQuestionStatus(2);
                    console.log(questionStatus);
                    break;
                case 'select_question':
                    //fetch
                    console.log(props.data.quiz._id)
                    getCurrentQuestion(props.data.quiz._id)
                        //setstate
                        .then(res => {
                            console.log(res)

                            console.log(res.questions[res.questions.length - 1].question)
                            props.newState({
                                quiz: {
                                    ...props.data.quiz,
                                    currentQuestion: res.questions[res.questions.length - 1].question
                                }
                            })

                        })
                        .then(props.history.push('/quiz'))
                        .catch(() => console.log("Something went wrong"))
                    break;
                default:
                    console.log(msg.data)
            }
        }
    })

    if (!questionClosed) {

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

    } else {
        if (questionStatus == 0) {
            return (
                <div>
                    <h1>Waiting for quizmaster to approve your question...</h1>
                </div>
            )
        } if (questionStatus == 1) {
            return (
                <div>
                    <h1>That was the correct answer!</h1>
                    <h2>Your team has 0 correct answers</h2>
                </div>
            )
        } if (questionStatus == 2) {
            return (
                <div>
                    <h1>That was the wrong answer!</h1>
                    <h2>Your team has 0 correct answers</h2>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>No question Status</h1>
                </div>
            )
        }
    }
}

export default withRouter(Answer)
