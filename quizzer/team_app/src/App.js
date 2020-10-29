import React from 'react';
import './App.css';
import Logo from './components/childcomponents/Logo'
import Login from './components/Login'
import QuestionInfo from './components/QuestionInfo'
import AnswerField from './components/AnswerField'
import Waiting from './components/Waiting'
import { Switch, Route } from 'react-router-dom'
import { openWebSocket, changeTeamName } from './serverCommunication';


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

  getNewState = (data) => {
    this.setState(data);
  }

  changeName = () => {
    console.log(this.state)
    changeTeamName(this.state.quiz._id, this.state.team.teamname)
    .then(res => console.log(res))
  }

  //Websockets

  render() {
    return <div className="App">
      <Switch>
        <Route exact path="/">
          <Logo title={"Quizzer"} page={"Login"}></Logo>
          <Login data={this.state} newState={this.getNewState}></Login>
        </Route>
        <Route exact path="/quiz">
          <Waiting data={this.state} newState={this.getNewState}
           waitmessage={"Waiting for other teams to join..."}
           newTeamName={this.changeName}></Waiting>
        </Route>
        <Route exact path="/quizzes">
          <Logo title={"Quizzer"} page="Question"></Logo>
          <QuestionInfo currentQuestion={"Example question"}></QuestionInfo>
          <AnswerField saveAnswer={this.saveNewAnswer}></AnswerField>
        </Route>

      </Switch>

    </div>
  }
}