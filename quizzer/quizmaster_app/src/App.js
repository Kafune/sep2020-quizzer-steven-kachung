import React from 'react';
import './App.css';
import RoomPanel from'./components/RoomPanel'
import NewTeamsPanel from'./components/NewTeamsPanel'
import NextStepButton from './components/NextStepButton';
import ApprovedTeamsPanel from './components/ApprovedTeamsPanel';
import QuizInformation from './components/QuizInformation';
import {Switch} from 'react-router-dom'
import {Route} from 'react-router-dom'
import { openWebSocket} from './serverCommunication';



export class App extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       quiz: {
        password: '',
        round: '',
       },
        teams:  {
          id: ['1'],
          name: ['test']
        },
        items: []
     }
  }

  componentDidMount() {
    this.onOpenSocket();
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
    })
  })
  .catch((error) => {
    console.error('Quizzer server error:', error);
  });
}

getNewTeams = () => {
  
}

  //Websockets
  addMessage(msg) {
    if(typeof msg !== "string") {
      msg = JSON.stringify(msg);
    }
    this.setState( (prevState) => ( {messages: [msg].concat(prevState.messages)}));
  };

  onOpenSocket() {
    console.log("onOpenSocket");
    let ws = openWebSocket();
    ws.onerror = () => this.addMessage('WebSocket error');
    ws.onopen = () => this.addMessage('WebSocket connection established');
    ws.onclose = () => this.addMessage('WebSocket connection closed');
    ws.onmessage = (msg) => this.addMessage(msg.data);
  }

  //Websockets

  render() {
     return  <div className="App">
       <Switch>
        <Route exact path="/">
        <NextStepButton handleButton={this.createNewQuiz}></NextStepButton>
        <RoomPanel password={this.state.quiz.password}></RoomPanel>
        </Route>
        <Route path="/quiz/approve-teams">
        <RoomPanel password={this.state.quiz.password}></RoomPanel>
        <NewTeamsPanel></NewTeamsPanel> 
        <ApprovedTeamsPanel></ApprovedTeamsPanel> 
        </Route>
       </Switch>
      {/* <NextStepButton handleButton={this.createNewQuiz}></NextStepButton>
      <RoomPanel password={this.state.quiz.password}></RoomPanel>
      <QuizInformation round={this.state.quiz.round}></QuizInformation>
      <NewTeamsPanel></NewTeamsPanel> 
      <ApprovedTeamsPanel></ApprovedTeamsPanel>  */}
  </div>
  }
}