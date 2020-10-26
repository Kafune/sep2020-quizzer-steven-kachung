import React from 'react';
import './App.css';
import RoomPanel from './components/RoomPanel'
import NewTeamsPanel from './components/NewTeamsPanel'
import NextStepButton from './components/NextStepButton';
import ApprovedTeamsPanel from './components/ApprovedTeamsPanel';
import QuizInformation from './components/QuizInformation';
import Teams from './components/Teams'
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
    console.log(this.state);
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
          <Teams quiz={this.state.quiz} password={this.state.quiz.password} teams={this.state.quiz.teams} id={this.state.quiz._id}></Teams>
        </Route>
        <Route exact path="/quiz/select-categories">

        </Route>
        <Route exact path="/quiz/questions">

        </Route>
      </Switch>
    </div>
  }
}