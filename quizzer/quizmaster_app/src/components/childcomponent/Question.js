import React from 'react';
import { useHistory, Link } from "react-router-dom";
import { useState } from "react"
import Button from './Button';
import { getWebSocket } from '../../ServerCommunication';


function Question(props) {
  const history = useHistory();
  const appState = props.appState;

  const nextStep = (e) => {
    const question = document.getElementById("question" + props.data._id).innerHTML;
    //Save the selected question in the database
    fetch('http://localhost:3000' + '/quiz/' + appState.quiz._id + '/questions/', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "question": props.data
      })
    })
      .then(result => result.json())
      .then(response =>{ 
        props.newState(response.round.chosen_questions[response.round.chosen_questions.length - 1])
        props.onQuestionSelect(response.round.chosen_questions[response.round.chosen_questions.length - 1])
      })
      .then(() => {
        const msg = {
          role: 'quizmaster',
          quiz_id: appState.quiz._id,
          request: 'select_question'
        }
        const ws = getWebSocket();
        ws.send(JSON.stringify(msg));
      })
      .then(history.push('/quiz/answers'))
  }

  return <React.Fragment>
    <div className="card" onClick={nextStep}>
      <div className="card-header">
        <p className="card-text" id={"question" + props.data._id} value={props.data.question}>{props.data.question}</p>
        <h3 className="card-title">{props.data.category}</h3>
      </div>
    </div>
    <br></br>
  </React.Fragment>

}
export default Question;
