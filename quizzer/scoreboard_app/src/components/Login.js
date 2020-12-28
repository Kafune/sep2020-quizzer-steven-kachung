import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { login, getQuiz,openWebSocket } from "../ServerCommunication";
export default function Login(props) {
  const [password, setPassword] = useState([]);

  const loginScoreboard = (password) => {
    login(password).then((response) => {
      if (response.loggedIn === true) {

        getQuiz(response.quizId).then(props.savePrefsWebsocket())
        //   .then(() => {
        //     const msg = {
        //         role: 'scoreboard',
        //         request: '',
        //         quiz_id: props.data._id
        //       }
        //       const ws = openWebSocket();
        //       ws.send(JSON.stringify(msg));
        //   })
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
