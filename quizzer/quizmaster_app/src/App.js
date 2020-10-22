import React from 'react';
import './App.css';
import RoomPanel from'./components/RoomPanel'
import NewTeamsPanel from'./components/NewTeamsPanel'
import NextStepButton from './components/NextStepButton';
import ApprovedTeamsPanel from './components/ApprovedTeamsPanel';
import QuizInformation from './components/QuizInformation';
import {Switch} from 'react-router-dom'
import {Route} from 'react-router-dom'


export class App extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       quiz: {
        password: '',
        round: '',
       },
        teams:  [],
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
        id: data._id,
        password: data.password,
        round: data.round
      } 
    })
  })
  .catch((error) => {
    console.error('Quizzer server error:', error);
  });
}

getTeams = () => {
  fetch('http://localhost:3000/quiz/5f8987db6749d52d1ccf0996', {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    this.setState( {
      teams: data.teams
    })
  })
  .catch((error) => {
    console.error('Quizzer server error:', error);
  });
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
     return  <div className="App">
       <Switch>
            <Route exact path="/">
              <NextStepButton handleButton={this.createNewQuiz}></NextStepButton>        
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

            </Route>
            <Route exact path="/quiz/select-categories">
    
            </Route>
            <Route exact path="/quiz/questions">
    
           </Route>
          </Switch>
  </div>
  }
}