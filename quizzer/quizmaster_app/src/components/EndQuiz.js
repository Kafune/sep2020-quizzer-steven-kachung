import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getWebSocket, createNewRound, requestEndQuiz } from '../ServerCommunication';
import Button from './childcomponent/Button';

function EndQuiz(props) {
    useEffect(() => {
        let ws = getWebSocket();
        ws.onerror = () => { }
        ws.onopen = () => { }
        ws.onclose = () => { }
        ws.onmessage = msg => { }
    })

    const startNewRound = () => {
        createNewRound(props.appState.quiz._id)
            .then(response => {
                console.log(response)
                props.newState({
                    quiz: {
                        ...props.appState.quiz,
                        round: {
                            ...props.appState.quiz.round,
                            chosen_categories: [],
                            chosen_questions: [],
                            number: response.round.number,
                            questionNumber: 1,
                            teams_answered: []
                        }
                    }
                })
            })
            .then(() => {
                const msg = {
                    request: "start_round"
                };
                const ws = getWebSocket();
                ws.send(JSON.stringify(msg));
            })
            .then(() => props.history.push('/quiz/select-categories'))
    }

    const endQuiz = () => {
        requestEndQuiz(props.appState.quiz._id)
            .then(() => {
                //zet alles terug naar hoe het eerst stond
                props.newState({
                    quiz: {
                        round: {
                          number: 1,
                          questionNumber: 1,
                          chosen_categories: [],
                          chosen_questions: [],
                          teams_answered: []
                        },
                        approvedTeams: [],
                        questionInfo: {
                          question: '',
                          answer: '',
                          category: ''
                        },
                      }
                })
            })
            .then(() => {
                const ws = getWebSocket();

                const msg = {
                    request: "end_quiz"
                  }
                ws.send(JSON.stringify(msg));
                ws.close();
                props.history.push('/')
            })
    }

    return (
        <>
            <h2>Quiz has ended</h2>
            <Button text="Play another round" color="btn-success pull-right" clickEvent={startNewRound} />
            <Button text="End quiz night" color="btn-danger pull-right" clickEvent={endQuiz} />
        </>
    )
}


export default withRouter(EndQuiz);

