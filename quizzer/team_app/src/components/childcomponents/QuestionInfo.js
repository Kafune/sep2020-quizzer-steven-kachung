import React from 'react'

function QuestionInfo(props) {
      return <>
        <h4>Round {props.roundNumber}</h4>
        <h4>Question {props.questionNumber}</h4>
        <h3>{props.currentQuestion}</h3>
      </> 
    
  }
  export default QuestionInfo;