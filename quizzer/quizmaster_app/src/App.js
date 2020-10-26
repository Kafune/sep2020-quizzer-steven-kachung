import React from 'react';
import './App.css';
import RoomPanel from './components/RoomPanel'
import NewTeamsPanel from './components/NewTeamsPanel'
import NextStepButton from './components/NextStepButton';
import ApprovedTeamsPanel from './components/ApprovedTeamsPanel';
import QuizInformation from './components/QuizInformation';
import { Switch } from 'react-router-dom';
import { Route, Link } from 'react-router-dom';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './ServerCommunication';
import { isCompositeComponent } from 'react-dom/test-utils';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '',
        password: '',
        round: '',
        teams: []
      }
    }
  }

  componentDidMount() {
    let ws = openWebSocket();
    ws.onerror = () => { };
    ws.onopen = () => { console.log('connected') };
    ws.onclose = () => { };
    ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg)
  }

  createNewQuiz = () => {
    startQuiz().then(json => this.setState({ quiz: json }));
    console.log(this.state.quiz);
  }

  fetchTeams = () => {
    //TODO: zet alle teams in de teams array.
    // console.log(this.state.quiz);
    getTeams(this.state.quiz._id)
      .then(request => request.json())
      .then(response => this.setState({ quiz: { ...this.state.quiz, teams: response } }));
      console.log(this.state.quiz);
  }

acceptTeam = (data) => {
     fetch('http://localhost:3000/quiz/5f8987db6749d52d1ccf0996/teams/', {
      method: 'PUT',
      mode: 'cors', 
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": data.name
      })
    });
}


denyTeam = () => {
  console.log("Deny current team")
}

  render() {
    return <div className="App">
      <h1>Quizzer</h1>
      <Switch>
        <Route exact path="/">
          <Link to="/quiz/approve-teams">
            <NextStepButton handleButton={this.createNewQuiz}
              buttonText="Start new quiz night"></NextStepButton>
          </Link>
        </Route>
        <Route exact path="/quiz/approve-teams">
          <RoomPanel
            password={this.state.quiz.password}>
          </RoomPanel>

          <NewTeamsPanel
            handleGetTeams={this.fetchTeams}
            handleAcceptButton={this.acceptTeam}
            handleDenyButton={this.denyTeam}
            teams={this.state.quiz.teams}>
          </NewTeamsPanel>

          <NextStepButton handleButton={this.selectCategories}
            buttonText="Select categories"></NextStepButton>

        </Route>
        <Route exact path="/quiz/select-categories">

        </Route>
        <Route exact path="/quiz/questions">

        </Route>
      </Switch>
    </div>
  }
}