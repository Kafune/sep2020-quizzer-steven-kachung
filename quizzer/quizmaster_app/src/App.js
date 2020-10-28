import React from 'react';
import './App.css';
import NextStepButton from './components/NextStepButton';
import QuestionPanel from './components/QuestionPanel';
import Teams from './components/Teams'
import { Switch } from 'react-router-dom';
import { Route, Link } from 'react-router-dom';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './ServerCommunication';
import { isCompositeComponent } from 'react-dom/test-utils';
import AnswerOverview from './components/AnswerOverview';
import EndQuiz from './components/EndQuiz';
import Panel from './components/Panel';
import Categories from './components/Categories';

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
    ws.onerror = () => { console.log('error') };
    ws.onopen = () => { console.log('connected') };
    ws.onclose = () => { };
    ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg.data)
  }

  createNewQuiz = () => {
    startQuiz().then(json =>{
      this.setState(() => ({
        ...this.state.quiz,
        quiz: json
      }), () => console.log(json));
    });
    
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
        <Route exact path="/quiz/approve-teams" render={() => <Teams data={this.state}></Teams>}/>
        <Route exact path="/quiz/select-categories">
          <Categories></Categories>
        </Route>
        <Route exact path="/quiz/questions">
            <QuestionPanel></QuestionPanel>
        </Route>
        <Route exact path="/quiz/answers">
          <AnswerOverview></AnswerOverview>
        </Route>
        <Route exact path="/quiz/end">
          
        </Route>
      </Switch>
    </div>
  }
}