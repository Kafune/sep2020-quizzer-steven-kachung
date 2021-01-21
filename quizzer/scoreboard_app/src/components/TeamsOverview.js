import React from "react";
import { getWebSocket,getQuiz } from "../ServerCommunication";
import QuizInfo from "../components/QuizInfo";

class TeamsOverview extends React.Component {
  componentDidMount() {
    this.props.requestTeams()
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
        case "select_question":
          getQuiz(this.props.appState.password).then((response) => {
            this.props.newState({
              ...this.props.appState,
              round: response.round.number,
              quizInfoVisible: true, 
              question: {
                ...this.props.appState.question,
                category: response.round.chosen_questions[response.round.chosen_questions.length-1].category,
                currentQuestion: response.round.chosen_questions[response.round.chosen_questions.length-1].question
              },
              currentPage: "teams_answering",
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
          <td>{data.questions_answered}</td>
          <td>{data.score}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <QuizInfo appState={this.props.appState}></QuizInfo>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Teamname</th>
              <th scope="col">Correctly answered questions</th>
              <th scope="col">Current Round Points</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </React.Fragment>
    );
  }
}
export default TeamsOverview;
