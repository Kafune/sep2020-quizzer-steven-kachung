import React from "react";
import { getWebSocket, getQuiz } from "../ServerCommunication";

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
      if (this.checkJson(msg.data)) {
        const message = JSON.parse(msg.data);
        if (message.subject == "new_answer_result") {
          this.props.getNewAnswerResult({
            teamname: message.teamname,
            correct_answer: message.correct_answer,
          });
        }
      } else {
        switch (msg.data) {
          case "select_question":
            this.props.requestTeams()
            getQuiz(this.props.appState.password).then((response) => {
              this.props.newState({
                ...this.props.appState,
                round: response.round.number,
                answer_results: [],
                currentPage: "teams_overview",
              });
              return response;
            });
            break;
        }
      }
    };
  }

  checkJson = (message) => {
    try {
      JSON.parse(message);
    } catch {
      return false;
    }
    return true;
  };

  render() {
    const content = this.props.content.map((data) => {
      return (
        <div key={data.name} className="col-4">
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
