import React from 'react';
import './App.css';
import Logo from './components/childcomponents/Logo'
import Login from './components/Login'
import Answer from './components/Answer'
import Waiting from './components/Waiting'
import { Switch, Route } from 'react-router-dom'
import { openWebSocket } from './serverCommunication';


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '',
        password: '',
        round: '',
        currentQuestion: ''
      },
      team: {
        teamname: '',
        score: 0,
        status: 'not_accepted',
        answer: ''
      },
    }
  }

  // ws = () => {
  //   openWebSocket();
  // };

  componentDidMount() {
    // Fetchen van o.a. vragen
    console.log("onOpenSocket");
    const ws = openWebSocket();
    ws.onerror = () => { }
    ws.onopen = () => { }
    ws.onclose = () => { }
    ws.onmessage = msg => console.log(msg)
    // this.ws = ws;
  }


  getNewState = (data) => {
    this.setState(data);
    console.log(this.state)
  }

  changeName = () => {
    console.log(this.state.team.teamname)

      .then(res => {
        const oldTeam = res.teams.find(team => team._id == this.state.team.teamname)
        console.log(res.teams)
        console.log(oldTeam)

      })
  }

  inputChange = () => {

  }

  //Websockets

  render() {
    return <div className="App">
      <h1>Quizzer</h1>
      
      <Switch>
        <Route exact path="/">
          <Logo title={"Quizzer"} page={"Login"}></Logo>
          <Login data={this.state} newState={this.getNewState}
            changeInputValue={this.inputChange}></Login>
        </Route>
        <Route exact path="/quiz">
          <Waiting data={this.state} newState={this.getNewState}
            waitmessage={"Waiting for other teams to join..."}
            newTeamName={this.changeName}/>
        </Route>
        <Route exact path="/quiz/question">
          {/* <Logo title={"Quizzer"} page="Question"></Logo> */}
          <Answer data={this.state} saveAnswer={this.saveNewAnswer}></Answer>
        </Route>

      </Switch>

    </div>
  }
}