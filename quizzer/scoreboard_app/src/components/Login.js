import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { login, openWebSocket, getQuiz } from "../ServerCommunication";
export default function Login(props) {
  const [password, setPassword] = useState([]);

  const startWebsocket = () => {
    let ws = openWebSocket();
    ws.onerror = () => {
      console.log("error");
    };
    ws.onopen = () => {
      getQuiz(password)
        .then((response) => {
          props.newState({
            ...props.data,
              _id: response._id,
              round: response.round.number,
              currentPage: "waiting",
          })
          return response;
        }
        )
        .then((response) => {
          console.log(props.data);
          const msg = {
            role: "scoreboard",
            request: "",
            quiz_id: response._id,
          };
          ws.send(JSON.stringify(msg));
        });
    };
    ws.onclose = () => {};
  };

  const loginScoreboard = (password) => {
    login(password).then((response) => {
      if (response.loggedIn === true) {
        startWebsocket();
      }
    });
  };

  return (
    <React.Fragment>
      <InputField
        text="Fill in your room password"
        id="password"
        handleInput={(e) => setPassword(e.target.value)}
      />
      <Button
        text="Submit team"
        color="btn-primary"
        clickEvent={() => loginScoreboard(password)}
      />
    </React.Fragment>
  );
}
