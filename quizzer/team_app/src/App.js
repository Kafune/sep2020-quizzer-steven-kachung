import React from 'react';
import './App.css';
import Logo from './components/childcomponents/Logo'
import Login from './components/Login'
import QuestionInfo from './components/QuestionInfo'
import AnswerField from './components/AnswerField'
import Waiting from './components/Waiting'
import { Switch, Route } from 'react-router-dom'
import { openWebSocket, getWebSocket, startLogin, getQuizInfo } from './serverCommunication';


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '',
        password: '',
        round: ''
      },
      team: {
        teamname: '',
        score: 0,
        status: 'not_accepted'
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


  saveNewTeam = () => {
    //get room based on pass
    getQuizInfo(this.state.quiz.password)
    .then(res => console.log(res))
    // startLogin(this.state.team.teamname, this.state.quiz.password, this.state.quiz._id)
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

  render() {
    return <div className="App">
      <Switch>
        <Route exact path="/">
          <Logo title={"Quizzer"} page={"Login"}></Logo>
          <Login data={this.state}></Login>
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