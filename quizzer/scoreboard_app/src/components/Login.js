import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { login, getQuiz,getWebSocket } from "../ServerCommunication";
export default function Login(props) {
  const [password, setPassword] = useState([]);
  async function loginScoreboard (password)  {
    login(password).then((response) => {
      if (response.loggedIn === true) {

        getQuiz(response.quizId).then(props.savePrefsWebsocket())
   
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
