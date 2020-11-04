import React from 'react';
import { openWebSocket, getWebSocket } from './ServerCommunication';
import './App.css';
import TableContent from './components/TableContent';


class App extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          _id: '', //scoreboard of the quiz
          round: '', //current round of a quiz
          teams: [],
          currentPage: 'waiting',
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
        // const msg = {
        //   role: "scoreboard",
        //   request: "",
        //   quiz_id: this.state._id
        // }
        // ws.send(JSON.stringify(msg))
        console.log('connected') 
      };
      ws.onclose = () => { };
      ws.onmessage = msg => {
        switch (msg.data) {
            case 'quiz_started':
                this.startQuiz();
                break;
            case 'new_quiz':
              console.log("nieuwe quiz")
                this.newQuiz()
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
  .then(response => this.getAcceptedTeams(response))
  .then(response => this.setState({...this.state, teams: response }))
}
  newQuiz = () => {
    this.getQuiz();
  }

  startQuiz = () => {
    this.setState({...this.state, currentPage: 'answers'})
    this.getTeams();
  }

  getAcceptedTeams = (data) => {
    const items = data.filter(data => {     
      return data.status == 'accepted';
    });
    return items
  }

  render() {

  if (this.state.currentPage == 'waiting') {
    return <div className="App">
      <h1>Waiting for a quiz to start...</h1>
      <button onClick={console.log(this.state)}>Ophalen</button>
 
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
