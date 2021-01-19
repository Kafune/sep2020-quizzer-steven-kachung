import React from "react";
import { getWebSocket } from "../ServerCommunication";

class TeamResult extends React.Component {
  componentDidMount() {
    let ws = getWebSocket();
    ws.onerror = () => {
      console.log("error");
    };
    ws.onopen = () => {
      console.log("connected");
    };
    ws.onclose = () => {};
    ws.onmessage = (msg) => {
      const message = JSON.parse(msg.data);
      if (message.subject == "new_answer_result") {
        this.props.getNewAnswerResult({
          teamname: message.teamname, 
          correct_answer: message.correct_answer
        });
      }
    };
  }

  render() {
    const content = this.props.content.map((data) => {
      return (
        <div className="col-4">
          <p>Name: {data.name}</p>
          <p>Answer: {data.answer}</p>
          {data.result ? <p>Result: Correct!</p> : <p>Result: Incorrect!</p>}
        </div>
      );
    });
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </React.Fragment>
    );
  }
}
export default TeamResult;
