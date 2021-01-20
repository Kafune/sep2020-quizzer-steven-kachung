import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Button from './childcomponents/Button';
import QuestionInfo from './childcomponents/QuestionInfo';
import { getWebSocket, submitAnswer, getCurrentQuestion, getTeamInfo } from './../serverCommunication';


function Answer(props) {
    const appState = props.data;
    const [answer, setAnswer] = useState('');
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
                const ws = getWebSocket();
                ws.send(JSON.stringify(msg));
            })
            .then(setHasAnswered(true))
            .catch(console.log("something went wrong"))
    }

    const searchTeams = (teamName, array) => {
        return array.find(team => team._id == teamName)
    }

    useEffect(() => {
        console.log(appState)
        const ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => {
            switch (msg.data) {
                case 'closed_question':
                    setQuestionClosed(true);
                    break;
                case 'question_approved' || 'question_denied':
                    getTeamInfo(appState.quiz._id, appState.team.teamname)
                        .then(result => {
                            const currentTeam = searchTeams(appState.team.teamname, result.teams)
                            props.newState({
                                team: {
                                    ...props.data.team,
                                    questions_answered: currentTeam.questions_answered,
                                    score: currentTeam.score
                                }
                            })
                        })

                case 'question_approved':
                    setQuestionStatus(1);
                     break;
                case 'question_denied':
                    // bugfix voor als een team de eerste vraag fout heeft.
                    if(!appState.team.questions_answered) {
                        props.newState({
                            team: {
                                ...props.data.team,
                                questions_answered: 0,
                            }
                        })
                    }
                    setQuestionStatus(2);
                    break;
                case 'select_question':
                    //fetch
                    
                    getCurrentQuestion(props.data.quiz._id)
                        //setstate
                        .then(res => {
                            props.newState({
                                quiz: {
                                    ...props.data.quiz,
                                    questionNumber: props.data.quiz.questionNumber + 1,
                                    currentQuestion: res.questions[res.questions.length - 1].question
                                }
                            })
                        })
                        .then(props.history.push('/quiz/waiting'))
                        .catch(() => console.log("Something went wrong"))
                    break;
                case 'end_round':
                    getTeamInfo(appState.quiz._id, appState.team.teamname)
                    .then(result => {
                        const currentTeam = searchTeams(appState.team.teamname, result.teams)
                        props.newState({
                            team: {
                                ...props.data.team,
                                questions_answered: currentTeam.questions_answered,
                                score: currentTeam.score
                            }
                        })
                    })

                    props.history.push('/quiz/round/end')
                    break;
                default:
                    console.log(msg.data)
                    break;
            }
        }
    })

    if (!questionClosed) {

        return (
            <React.Fragment>
                <QuestionInfo roundNumber={appState.quiz.round}
                questionNumber={appState.quiz.questionNumber}
                 currentQuestion={appState.quiz.currentQuestion} />
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
                    <h2>Your team has {props.data.team.questions_answered} correct answers</h2>
                </div>
            )
        } if (questionStatus == 2) {
            return (
                <div>
                    <h1>That was the wrong answer!</h1>
                    <h2>Your team has {props.data.team.questions_answered} correct answers</h2>
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
