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
        // teams: [],
        approvedTeams: [],
        questionInfo: {
          // number: 1,
          question: '',
          answer: '',
          category: ''
        },
      }
    }
  }

  componentDidMount() {
    this.createNewQuiz();
    let ws = openWebSocket();
    ws.onerror = () => { console.log('error') };
    ws.onopen = () => { console.log('connected') };
    ws.onclose = () => { };
    ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg.data)

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

  setNewState = (data) => {
    this.setState(data);
  }

  setQuestionInfo = question => {
    this.setState({
      quiz: {
        ...this.state.quiz,
        questionInfo: question
      }
    })
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
          <Teams appState={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/select-categories">
          <h2>Question: {this.state.quiz.round.number}</h2>
          <Categories appState={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/questions">
          <h2>Question: {this.state.quiz.round.number}</h2>
          <QuestionPanel appState={this.state} newState={this.setNewState} onQuestionSelect={this.setQuestionInfo} />
        </Route>
        <Route exact path="/quiz/answers">
          <h2>Question: {this.state.quiz.round.number}</h2>
          <AnswerOverview data={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/end">
          <h1>Quiz has ended.</h1>
        </Route>
      </Switch>
    </div>
  }
}