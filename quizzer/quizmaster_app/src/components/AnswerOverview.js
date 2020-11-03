import React, {useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import Button from './childcomponent/Button';
import {getWebSocket} from './../ServerCommunication';
import TableContent from './childcomponent/TableContent';

function AnswerOverview(props) {
  let tableCount = 0;
  const teamAnsweredData = props.data.quiz.round.teams_answered;

  useEffect(() => {
      const ws = getWebSocket();
      ws.onerror = () => { }
      ws.onopen = () => { }
      ws.onclose = () => { }
      ws.onmessage = msg => {
        console.log(JSON.parse(msg.data))
        props.newState({
          // (JSON.parse(msg.data))
          quiz: {
            round: {
              teams_answered: [
                ...teamAnsweredData,
                JSON.parse(msg.data)
              ]
            }
          }
        })
        console.log(teamAnsweredData)
        console.log(JSON.parse(msg.data))
        console.log(JSON.parse(msg.data))
      }
  })

  const teamAnswer = teamAnsweredData.map((data) => {
    tableCount++;
    return <tr>
      <td>{tableCount}</td>
      <td>{data.teamname}</td>
      <td>{data.answer}</td>
    </tr>
  });
  console.log(teamAnsweredData)

  const closeQuestion = () => {
    console.log("hier")

    // props.history.push()
  }

  return <React.Fragment>
    <h2>Select a question</h2>
    <table className="table table-bordered">
      <thead className="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Team</th>
          <th scope="col">Answer</th>
        </tr>
      </thead>
      {teamAnswer}
    </table>
    <TableContent teams={['rood', 'groen', 'blauw']} answer={['test', 'testje']}></TableContent>
    <Button text="Close question" color="btn-primary" clickEvent={closeQuestion} />
  </React.Fragment>
}

export default withRouter(AnswerOverview);

