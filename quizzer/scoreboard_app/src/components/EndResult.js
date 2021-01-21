import React, { useEffect } from "react";
import { getWebSocket, getQuiz } from "../ServerCommunication";

export default function EndResult(props) {
  useEffect(() => {
    console.log(props.appState.round_score);
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
        case "end_quiz":
          props.newState({
            _id: "",
            password: "",
            quizInfoVisible: true,
            round: "",
            teams: [],
            currentPage: "login",
            teams_answered: [],
            answer_results: [],
            round_score: [],
            question: {
              number: 1,
              currentQuestion: "",
              category: "",
            },
          });
          ws.close();
        break;
        case "start_round":
          props.requestTeams();
          getQuiz(props.appState.password).then((response) => {
            props.newState({
              ...props.appState,
              quizInfoVisible: false,
              round: response.round.number,
              answer_results: [],
              teams_answered: [],
              question: {
                ...props.appState.question,
                number: 1,
              },
              currentPage: "teams_overview",
            });
            return response;
          });
          break;
      }
    };
  });

  return (
    <React.Fragment>
      <h2>Round result</h2>
      <div className="container">
        <div id="podium-box">
          {props.appState.round_score.map((items, index) => {
            if (index === 0) {
              return (
                <div class="col-sm step-container m-0 p-0 first">
                  <div
                    id="first-step"
                    className="bg-gold step centerBoth podium-number"
                  >
                    <h3>Team name: {items._id}</h3>
                    <h3>Round Points: {items.score}</h3>
                  </div>
                </div>
              );
            }
            if (index === 1) {
              return (
                <div class="col-sm step-container m-0 p-0 second">
                  <div
                    id="second-step"
                    className="bg-silver step centerBoth podium-number"
                  >
                    <h3>Team name: {items._id}</h3>
                    <h3>Round Points: {items.score}</h3>
                  </div>
                </div>
              );
            }
            if (index === 2) {
              return (
                <div class="col-sm step-container m-0 p-0 third">
                  <div
                    className="bg-bronze step centerBoth podium-number"
                    id="third-step"
                  >
                    <h3>Team name: {items._id}</h3>
                    <h3>Round Points: {items.score}</h3>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="whitespace">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Teamname</th>
              <th scope="col">Correctly answered questions</th>
              <th scope="col">Current Round Points</th>
            </tr>
          </thead>
          <tbody>
            {props.content.map((data) => {
              return (
                <tr key={data._id}>
                  <td>{data._id}</td>
                  <td>{data.questions_answered}</td>
                  <td>{data.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </React.Fragment>
  );
}
