import React from "react";
import { getWebSocket, getQuiz } from "../ServerCommunication";
import QuizInfo from "../components/QuizInfo";

class TeamsAnswering extends React.Component {
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
      switch (msg.data) {
        case "new_answer":
          this.props.getTeamsWhoAnswered();
          break;
        case "closed_question":
          getQuiz(this.props.appState.password).then((response) => {
            this.props.newState({
              ...this.props.appState,
              round: response.round.number,
              teams_answered: [],
              question: {
                ...this.props.appState.question,
                category: response.round.chosen_questions[response.round.chosen_questions.length-1].category,
                currentQuestion: response.round.chosen_questions[response.round.chosen_questions.length-1].question
              },
              currentPage: "answer_result",
            });
          });
          break;
      }
    };
  }

  render() {
    const content = this.props.content.map((data) => {
      return (
        <tr key={data._id}>
          <td>{data._id}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <QuizInfo appState={this.props.appState}></QuizInfo>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Teams that already answered</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </React.Fragment>
    );
  }
}
export default TeamsAnswering;
