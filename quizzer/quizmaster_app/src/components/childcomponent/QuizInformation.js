import React from 'react';

const QuizInformation = (props) => {
    return (
    <div>
        <p>Round: {props.round}</p>
        <p>Question: {props.question}</p>

    </div>
    )
  }
  

export default QuizInformation;