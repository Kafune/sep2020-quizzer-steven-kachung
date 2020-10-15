import React from 'react';
import './App.css';
import RoomPanel from'./components/RoomPanel'
import NewTeamsPanel from'./components/NewTeamsPanel'
import NextStepButton from './components/NextStepButton';
import ApprovedTeamsPanel from './components/ApprovedTeamsPanel';
import QuizInformation from './components/QuizInformation';

export class App extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       quiz: {
        password: '',
        round: '',
       },
        teams:  {
          id: [],
          name: ['hoi','hallo']
        },
        items: []
     }
  }

  componentDidMount() {

    
   }

createNewQuiz = () =>{
  fetch('http://localhost:3000/quiz/', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
  .then(data => {

    this.setState( {
      quiz: {
        password: data.password,
        round: data.round
      } 
    }
    
    )
  })
  .catch((error) => {
    console.error('Quizzer server error:', error);
  });
}

  render() {
     return  <div className="App">
      <NextStepButton handleButton={this.createNewQuiz}></NextStepButton>
      <RoomPanel password={this.state.quiz.password}></RoomPanel>
      <QuizInformation round={this.state.quiz.round}></QuizInformation>
      <NewTeamsPanel></NewTeamsPanel> 
      <ApprovedTeamsPanel></ApprovedTeamsPanel> 
  </div>
  }
}