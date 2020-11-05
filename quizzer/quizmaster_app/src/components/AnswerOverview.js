import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Button from './childcomponent/Button';
import { getWebSocket, addQuestionAnswered, assignPoints } from './../ServerCommunication';

function AnswerOverview(props) {
  let tableCount = 0;
  const teamAnsweredData = props.data.quiz.round.teams_answered;

  const [questionClosed, setQuestionClosed] = useState(false);
  // const [] = useState(false);

  const ws = getWebSocket();


  useEffect(() => {
    ws.onerror = () => { }
    ws.onopen = () => { }
    ws.onclose = () => { }
    ws.onmessage = msg => {
      if (!questionClosed) {
        props.newState({
          quiz: {
            ...props.data.quiz,
            round: {
              ...props.data.quiz.round,
              teams_answered: [
                ...teamAnsweredData,
                JSON.parse(msg.data)
              ]
            }
          }
        })
      } else {
        alert("Question is closed! No new answers accepted");
      }
      console.log(teamAnsweredData)
      console.log(JSON.parse(msg.data))
    }
  })



  const closeQuestion = () => {
    console.log("hier")
    const msg = {
      role: "quizmaster",
      quiz_id: props.data.quiz._id,
      request: "answer_result"
    }
    const clientMsg = {
      role: "quizmaster",
      quiz_id: props.data.quiz._id,
      request: "question_closed"
    }
    ws.send(JSON.stringify(msg));
    ws.send(JSON.stringify(clientMsg));
    setQuestionClosed(true);

  }

  const approveQuestion = (e) => {
    const teamName = e.target.getAttribute('data-item');
    console.log(props.data);

    addQuestionAnswered(props.data.quiz._id, teamName)
      .then(res => {
        console.log(res)
        const findClient = props.data.quiz.approvedTeams.filter(team => {
          return team._id == teamName
        })
        console.log(findClient)
        console.log(res)
        props.newState({
          quiz: {
            ...props.data.quiz,
            approvedTeams: res.teams
          }
        })
      })
      .then(() => {
        console.log(props.data)
        const msg = {
          role: "quizmaster",
          teamname: teamName,
          quiz_id: props.data.quiz._id,
          request: "approve_question"
        }
        console.log(msg);
        ws.send(JSON.stringify(msg));
      })
  }

  const denyQuestion = (e) => {
    const teamName = e.target.getAttribute('data-item');
    console.log(teamName);
    const msg = {
      role: "quizmaster",
      teamname: teamName,
      quiz_id: props.data.quiz._id,
      request: "deny_question"
    }

    console.log(msg);
    ws.send(JSON.stringify(msg));
  }

  const nextQuestion = () => {
    console.log("volgende vraag")
    props.newState({
      quiz: {
        ...props.data.quiz,
        round: {
          ...props.data.quiz.round,
          number: props.data.quiz.round.number + 1,
          teams_answered: []
        }
      }
    })
    const msg = {
      role: 'quizmaster',
      quiz_id: props.data.quiz._id,
      request: 'select_question'
    }
    const msg2 = {
      role: 'quizmaster',
      quiz_id: props.data.quiz._id,
      request: 'next_question'
    }
    const ws = getWebSocket();
    ws.send(JSON.stringify(msg));
    ws.send(JSON.stringify(msg2));
    props.history.push('/quiz/questions');
  }

  const quizResults = () => {
    const msg = {
      role: 'quizmaster',
      quiz_id: props.data.quiz._id,
      request: 'end_game'
    }
    ws.send(JSON.stringify(msg));
    const participants = props.data.quiz.approvedTeams.map(team => {
      console.log(team)
      return {
        teamname: team._id,
        correctAnswers: team.questions_answered,
        score: team.score
      }
    })
    console.log(participants);

    //give points out
    let sortedArray = participants.sort((team, team2) => parseFloat(team2.correctAnswers) - parseFloat(team.correctAnswers))
    let scoreIncrease = 4;
    let index = 0;
    console.log(sortedArray)
    sortedArray.forEach(item => {
      item.score = item.score + scoreIncrease
      assignPoints(props.data.quiz._id, item.teamname, item.score)
      if(index > 2) {
        scoreIncrease = 0.1
      } else {
        scoreIncrease = scoreIncrease / 2
      }
    }) 

    props.history.push('/quiz/end');

  }

  //show table based on closed question or no
  const teamAnswer = teamAnsweredData.map((data) => {
    tableCount++;
    return <tr>
      <td>{tableCount}</td>
      <td>{data.teamname}</td>
      <td>{data.answer}</td>
    </tr>
  });

  const showAnsweredQuestions = teamAnsweredData.map(data => {
    return <tr>
      <td>{data.teamname}</td>
      <td>{data.answer}</td>
      <td>
        {/* <Button text="Yes" color="btn-success" clickEvent={approveQuestion(data.teamname)} />
        <Button text="No" color="btn-primary" clickEvent={denyQuestion} /> */}
        <button data-item={data.teamname} onClick={approveQuestion} className="btn-success">Yes</button>
        <button data-item={data.teamname} onClick={denyQuestion} className="btn-danger">No</button>

      </td>
    </tr>
  });

  // const thisState = props.data.quiz.round.chosen_questions[props.data.quiz.round.chosen_questions.length - 1];
  // const state2 = props.data.quiz.round.chosen_questions;
  // const lastQuestion = props.data.quiz.round.chosen_questions.question;
  // const lastQuestionInfo =  props.data.quiz.round.chosen_questions[0].question
  // props.data.quiz.round.chosen_questions.length-1

  if (!questionClosed) {
    return <React.Fragment>
      <h2>Question</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr key={tableCount}>
            <th scope="col">#</th>
            <th scope="col">Team</th>
            <th scope="col">Answer</th>
          </tr>
        </thead>
        <tbody>
          {teamAnswer}
        </tbody>
      </table>
      <Button text="Close question" color="btn-primary" clickEvent={closeQuestion} />
    </React.Fragment>
  } else {
    console.log("true")
    const lastQuestionAnswer = props.data.quiz.round.chosen_questions.answer;

    return <React.Fragment>
      {/* <h2>Question: {lastQuestion}</h2> */}
      <h3>Answer: {lastQuestionAnswer}</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Team</th>
            <th scope="col">Answer</th>
            <th scope="col">Approve question?</th>
          </tr>
        </thead>
        <tbody>
          {showAnsweredQuestions}
        </tbody>
      </table>
      {/* Als 12 rondes niet voorbij zijn: */}
      <Button text="Next question" color="btn-primary" clickEvent={nextQuestion} />
      {/* Als 12 rondes WEL voorbij zijn: */}
      <Button text="Show quiz results" color="btn-success" clickEvent={quizResults} />

    </React.Fragment>
  }

}

export default withRouter(AnswerOverview);

