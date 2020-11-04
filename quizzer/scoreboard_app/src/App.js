import React from 'react';
import { openWebSocket, getWebSocket } from './ServerCommunication';
import './App.css';
import TableContent from './components/TableContent';
import List from './components/List';


class App extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          _id: '', //scoreboard of the quiz
          round: '', //current round of a quiz
          teams: [],
          currentPage: 'waiting',
          teams_answered: [],
          question: {
            number: 1,
            currentQuestion: '',
            category: ''
          },
      }
    }

    componentDidMount() {
      const ws = openWebSocket();
      ws.onerror = () => { console.log('error') };
      ws.onopen = () => { 
        console.log('connected') 
      };
      ws.onclose = () => { };
      ws.onmessage = msg => {
        switch (msg.data) {
          case 'new_quiz':
            this.newQuiz();
            console.log("nieuwe quiz")
            break;
            case 'select_category':
                console.log("categorie aan het selecteren")
                this.startQuiz();          
                break;
            case 'quiz_started':
                  console.log("quiz is begonnen")
                  this.setState({...this.state, currentPage: 'teams_answering' })     
                  break;
            case 'new_answer':
                    console.log("nieuw antwoord is gegeven")
                    this.getTeamsWhoAnswered();
                    
                    break;
        }
        
    }}

getQuiz =() => {
  fetch('http://localhost:3000' + '/quiz/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
  .then(response => this.getLastItem(response))
  .then(response => this.setState({...this.state, _id: response._id, round: response.round.number, }))
}

getLastItem = (data) => {
  return data[data.length-1]
}

 getTeams = () => {
  fetch('http://localhost:3000' + '/quiz/' + this.state._id + '/teams/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
  .then(response => this.setState({...this.state, teams: response }))
}

getAcceptedTeams = (data) => {
  const items = data.filter(data => {     
    return data.status == 'accepted';
  });
  return items
}

  newQuiz = () => {
    this.getQuiz();
  }

  startQuiz = () => {
    this.setState({...this.state, currentPage: 'answers'})
    this.getTeams();
  }

  //Which has already answered a question
  getTeamsWhoAnswered = () => {
      fetch('http://localhost:3000' + '/quiz/' + this.state._id + '/teams/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
      }).then(response => response.json())
        .then(response => this.filterWhoHasAnswered(response))
        .then(response => this.setState({...this.state, teams_answered: response }))
  }

  filterWhoHasAnswered = (teams) => {
      const items = teams.filter(data => {     
        return data.answer != "";
      });
      return items;
  }


  render() {

  if (this.state.currentPage == 'waiting') {
    return <div className="App">
      <h1>Waiting for a quiz to start...</h1>
      <button onClick={this.getTeamsWhoAnswered}>Ophalen</button>
 
    </div>
  }

  if (this.state.currentPage == 'teams_answering') {
    return <div className="App">
      <div className="container">
        <div className="col-12">
        <List content={this.state.teams_answered}></List>
        <button onClick={this.getTeamsWhoAnswered}>Haal op</button>
      </div>
      </div>
    </div> 
  }

  if (this.state.currentPage == 'answers') {
    return <div className="App">
      <div className="container">
        <div className="col-12">
        <TableContent content={this.state.teams}></TableContent>
      </div>
      </div>
    </div> 
  }
  return (
    <div className="App">
      <h1>Quizzer</h1>
      <TableContent key={this.state._id} content={this.state.teams}></TableContent>
    </div>
  );
}
}

export default App;
