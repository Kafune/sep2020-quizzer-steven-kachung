import React from 'react';
import './App.css';
import Logo from './components/Logo'
import Login from './components/Login'
import QuestionInfo from './components/QuestionInfo'
import AnswerField from './components/AnswerField'
import Waiting from './components/Waiting'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { openWebSocket, getWebSocket, startLogin } from './serverCommunication';


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '',
        round: '',
      },
      team: {
        teamname: '',
        password: ''
      },
      answer: ''
    }
  }

  componentDidMount() {
    // Fetchen van o.a. vragen
    console.log("onOpenSocket");
    let ws = openWebSocket();
    ws.onerror = () => {}
    ws.onopen = () => {}
    ws.onclose = () => {}
    ws.onmessage = msg => console.log(msg)
  }


  saveNewTeam = (prefs) => {
    startLogin(prefs.teamname, prefs.password);
    this.setState({
        team: {
          teamname: prefs.teamname,
          password: prefs.password
        }
      });
  }

  saveNewAnswer = (answer) => {
    this.setState({
      answer: answer
    })
  }

  createNewQuiz = () => {
    fetch('http://localhost:3000/quiz/', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": ''
      })
    })
    .catch((error) => {
      console.error('Quizzer server error:', error);
    });
  }



  //Websockets

  onOpenSocket() {

  }
  addMessage(msg) {
    if (typeof msg !== "string") {
      msg = JSON.stringify(msg);
    }
    this.setState((prevState) => ({ messages: [msg].concat(prevState.messages) }));
  };

  onSend() {
    const msg = "Here's a brand new number: " + (Math.round(Math.random() * 1000000));
    const ws = getWebSocket();
    ws.send(msg);
  }

  //Websockets

  render() {
    return <div className="App">
      <Switch>
        <Route exact path="/">
          <Logo title={"Quizzer"} page={"Login"}></Logo>
          <Login saveNewTeam={this.saveNewTeam}></Login>
        </Route>
        <Route exact path="/quizzes">
          <Logo title={"Quizzer"} page="Question"></Logo>
          <QuestionInfo currentQuestion={"Example question"}></QuestionInfo>
          <AnswerField saveAnswer={this.saveNewAnswer}></AnswerField>
        </Route>
        <Route exact path="/wait">
          <Waiting waitmessage={"Waiting for other teams to join..."}></Waiting>
        </Route>
      </Switch>

    </div>
  }
}