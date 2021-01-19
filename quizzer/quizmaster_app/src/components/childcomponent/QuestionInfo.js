import React from 'react'

function QuestionInfo(props) {
      return <>
        <h3>Round {props.roundNumber}</h3>
        <h3>Question {props.questionNumber}</h3>
        <h4>{props.currentQuestion}</h4>
      </> 
    
  }
  export default QuestionInfo;