import React from 'react';
import './App.css';
import RoomPanel from './components/RoomPanel'
import NewTeamsPanel from './components/NewTeamsPanel'
import NextStepButton from './components/NextStepButton';
import ApprovedTeamsPanel from './components/ApprovedTeamsPanel';
import QuizInformation from './components/QuizInformation';
import { Switch } from 'react-router-dom';
import { Route, Link } from 'react-router-dom';
import { openWebSocket, getWebSocket, startQuiz } from './ServerCommunication';
import { isCompositeComponent } from 'react-dom/test-utils';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '',
        password: '',
        round: '',
      },
      teams: [],
      items: []
    }
  }

  componentDidMount() {

  }

  createNewQuiz = () => {
    startQuiz().then(json => this.setState({ quiz: json }));
    console.log(this.state.quiz);
  }

  getTeams = () => {
    // fetch('http://localhost:3000/quiz/'+this.state.quiz_id, {
    //   method: 'GET',
    //   credentials: 'include',
    //   mode: 'cors',
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //     this.setState({
    //       teams: data.teams
    //     })
    //   })
    //   .catch((error) => {
    //     console.error('Quizzer server error:', error);
    //   });

    let ws = openWebSocket();
    ws.onerror = () => {};
    ws.onopen = () => {};
    ws.onclose = () => {};
    ws.onmessage = (msg) => {};
  }

  acceptTeam = (data) => {
    console.log(data.name);

    fetch('http://localhost:3000/quiz/'+this.state.quiz_id+'/teams/', {
      method: 'PUT',
      body: {
        "name": data.name
      },
      credentials: 'include',
      mode: 'cors',
    })
      .catch((error) => {
        console.error('Quizzer server error:', error);
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
            handleGetTeams={this.getTeams}
            handleAcceptButton={this.acceptTeam}
            handleDenyButton={this.denyTeam}
            teams={this.state.teams}>
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