import React, { useEffect } from "react";
import { getWebSocket } from "../ServerCommunication";

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
    ws.onmessage = (msg) =>
      msg.data == "select_question"
        ? props.newState({
            ...props.appState,
            currentPage: "teams_answering",
          })
        : "";
  });
  return (
    <div className="App">
      <h2>{props.text}</h2>
    </div>
  );
}
