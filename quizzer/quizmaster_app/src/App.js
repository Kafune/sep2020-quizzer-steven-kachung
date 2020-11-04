import React from 'react';
import './App.css';
import Button from './components/childcomponent/Button';
import QuestionPanel from './components/QuestionPanel';
import Teams from './components/Teams'
import { Switch } from 'react-router-dom';
import { Route, Link } from 'react-router-dom';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './ServerCommunication';
import AnswerOverview from './components/AnswerOverview';
import EndQuiz from './components/EndQuiz';
import Categories from './components/Categories';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        _id: '', // Dit moet naar een session veranderd worden!
        password: '', // Dit moet naar een session veranderd worden!
        round: {
          number: '',
          chosen_categories: [],
          chosen_questions: [],
          teams_answered: []
        },
        teams: [],
        approvedTeams: [],
        question: {
          number: 1,
          currentQuestion: '',
          category: ''
        },
      }
    }
  }

  componentDidMount() {
    let ws = openWebSocket();
    ws.onerror = () => { console.log('error') };
    ws.onopen = () => { console.log('connected') };
    ws.onclose = () => { };
    ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg.data)

    this.createNewQuiz();
  }

  createNewQuiz = () => {
    startQuiz().then(json => {
      this.setState(() => ({
        quiz: {
          ...this.state.quiz,
          _id: json._id,
          password: json.password,
          round: {
            ...this.state.quiz.round,
            number: json.round.number
          }
        }
      }), () => console.log(json));
    }).then(() => {
      const msg = {
        role: 'quizmaster',
        quiz_id: this.state.quiz._id,
        request: 'new_quiz'
      }
      const ws = getWebSocket();
      ws.send(JSON.stringify(msg));

    });
    console.log(this.state);
  }

  getNewState = (data) => {
    this.setState(data);
  }


  render() {
    return <div className="App">
      <h1>Quizzer</h1>
      <Switch>
        <Route exact path="/">
          <Link to="/quiz/approve-teams">
            <Button
              text="Start new quiz night" color="btn-success"></Button>
          </Link>
        </Route>
        <Route exact path="/quiz/approve-teams">
         <Teams appState={this.state} newState={this.getNewState}></Teams>
         </Route>
        <Route exact path="/quiz/select-categories">
        <h2>Round: {this.state.quiz.round.number}</h2>
          <Categories appState={this.state} newState={this.getNewState}></Categories>
        </Route>
        <Route exact path="/quiz/questions">
        <h2>Round: {this.state.quiz.round.number}</h2>
          <QuestionPanel appState={this.state} newState={this.getNewState}></QuestionPanel>
        </Route>
        <Route exact path="/quiz/answers">
        <h2>Round: {this.state.quiz.round.number}</h2>
          <AnswerOverview data={this.state} newState={this.getNewState}/>
        </Route>
        <Route exact path="/quiz/end">

        </Route>
      </Switch>
    </div>
  }
}