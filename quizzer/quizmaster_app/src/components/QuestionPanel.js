import React from 'react';
import Question from './childcomponent/Question'
import Button from './childcomponent/Button'
import { withRouter } from 'react-router-dom';

class QuestionPanel extends React.Component {
  state = {
    chosen_questions: [],
  }

  appState = this.props.appState;

  componentDidMount() {
    this.getQuestions();
  }
  
  getQuestions = () => {
    fetch('http://localhost:3000' + '/api/v1/questions', {
      method: 'GET',
        mode: 'cors', 
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(result => result.json())
      .then(response => this.filterQuestions(response))
      .then(response => this.shuffleQuestions(response))
      .then(response => this.setState({chosen_questions: response.slice(0,3)}))
  }


  filterQuestions = (data) => {
    const chosen_categories = this.appState.quiz.round.chosen_categories 
    const newItems = data.filter((item) => {
      return chosen_categories.includes(item.category)
    });

    return newItems;
    }

    shuffleQuestions(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
      
    }

    newState = (data) => {
      const localState = {
      quiz: {
        ...this.props.appState.quiz,
        round: {
          ...this.props.appState.quiz.round,
          chosen_questions: [
            data
          ]
        }
      }
    }
      this.props.newState(localState);
    }


  
    render() {
      const questions = this.state.chosen_questions.map(data => {
        return <Question appState={this.appState} 
        newState={this.newState} 
        onQuestionSelect = {this.props.onQuestionSelect}
        key={data._id} data={data}/>
        
      });
    return <React.Fragment>
      <Button clickEvent={this.getQuestions} color="btn-success" text="Refresh"></Button>
      {questions}
      </React.Fragment>

    }
  }
  export default withRouter(QuestionPanel);
  