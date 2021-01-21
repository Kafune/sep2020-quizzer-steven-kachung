import React from 'react';

export default function QuizInfo(props) {
    return (
        (props.appState.quizInfoVisible == true) ?
        <div>
        <h4>Round {props.appState.round}</h4>
        <h4>Question {props.appState.question.number}</h4><br></br>
        <h3>Category: {props.appState.question.category}</h3>
        <h4>Current question: {props.appState.question.currentQuestion}</h4>
        </div>
        : ""
    )
}