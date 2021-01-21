import React, { useEffect } from "react";
import { getWebSocket, getQuiz } from "../ServerCommunication";

export default function WaitingScreen(props) {
  useEffect(() => {
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
        case "start_round":
          props.requestTeams()
          props.newState({
            ...props.appState,
            quizInfoVisible: false, 
            currentPage: "teams_overview",
          })
         
            break;
        case "select_question":
          getQuiz(props.appState.password)
          .then((response) => {
            props.newState({
              ...props.appState,
                round: response.round.number,
                question: {
                  number: response.round.questionNumber,
                  category: response.round.chosen_questions[response.round.chosen_questions.length-1].category,
                  currentQuestion: response.round.chosen_questions[response.round.chosen_questions.length-1].question
                },
                currentPage: "teams_answering",
            })}
          )
          break;
      }
    };
  });

  return (
    <div className="App">
      <h2>{props.text}</h2>
    </div>
  );
}
