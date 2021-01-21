import React from 'react';
import './App.css';
import Logo from './components/childcomponents/Logo'
import Login from './components/Login'
import Answer from './components/Answer'
import Waiting from './components/Waiting'
import { Switch, Route } from 'react-router-dom'
import ResultScreen from './components/ResultScreen';
import ChangeName from './components/ChangeName';


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '',
        password: '',
        round: 1,
        questionNumber: 1,
        currentQuestion: ''
      },
      team: {
        teamname: '',
        score: 0,
        status: 'not_accepted',
        answer: '',
        questions_answered: 0
      },
    }
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

  render() {
    return <div className="App">
      <h1>Quizzer</h1>
      
      <Switch>
        <Route exact path="/">
          <Logo title={"Quizzer"} page={"Login"}></Logo>
          <Login data={this.state} newState={this.getNewState}
       ></Login>
        </Route>
        <Route exact path="/quiz/team/edit">
          <ChangeName
          waitmessage={"Waiting for other teams to join..."}
          data={this.state} newState={this.getNewState}/>
        </Route>
        <Route exact path="/quiz/waiting">
          <Waiting data={this.state} newState={this.getNewState}

            newTeamName={this.changeName}/>
        </Route>

        <Route exact path="/quiz/question">
          {/* <Logo title={"Quizzer"} page="Question"></Logo> */}
          <Answer data={this.state} saveAnswer={this.saveNewAnswer}
          newState={this.getNewState}></Answer>
        </Route>
        <Route exact path="/quiz/round/end">
          <ResultScreen data={this.state} newState={this.getNewState}/>
        </Route>

      </Switch>

    </div>
  }
}