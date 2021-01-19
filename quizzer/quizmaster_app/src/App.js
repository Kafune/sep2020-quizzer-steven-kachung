import React from 'react';
import './App.css';
import QuestionPanel from './components/QuestionPanel';
import Teams from './components/Teams'
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import AnswerOverview from './components/AnswerOverview';
import Home from './components/Home';
import EndQuiz from './components/EndQuiz';
import Categories from './components/Categories';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        round: {
          number: 1,
          questionNumber: 1,
          chosen_categories: [],
          chosen_questions: [],
          teams_answered: []
        },
        approvedTeams: [],
        questionInfo: {
          question: '',
          answer: '',
          category: ''
        },
      }
    }
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
          <Home appState={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/approve-teams">
          <Teams appState={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/select-categories">
          <h2>Question: {this.state.quiz.round.questionNumber}</h2>
          <Categories appState={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/questions">
          <h2>Question: {this.state.quiz.round.questionNumber}</h2>
          <QuestionPanel appState={this.state} newState={this.setNewState} onQuestionSelect={this.setQuestionInfo} />
        </Route>
        <Route exact path="/quiz/answers">
          <AnswerOverview data={this.state} newState={this.setNewState} />
        </Route>
        <Route exact path="/quiz/end">
          <EndQuiz appState={this.state} newState={this.setNewState} />
        </Route>
      </Switch>
    </div>
  }
}