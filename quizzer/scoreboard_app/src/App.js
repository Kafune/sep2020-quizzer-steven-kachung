import React, { useState, useEffect } from 'react';
import './App.css';
import TableContent from './components/TableContent';


class App extends React.Component {
  // const [isLoading, setIsLoading] = useState(true);
  // const [data, setData] = useState({
  //   _id: '5fa17bb1200fe41b13052969', //scoreboard of the quiz
  //   round: '', //current round of a quiz
  //   teams: [

  //   ],
  //   currentPage: 'waiting',
  //   question: {
  //     number: 1,
  //     currentQuestion: '',
  //     category: ''
  //   },

  // });
  
    constructor(props) {
      super(props);
      this.state = {
        _id: '5fa17bb1200fe41b13052969', //scoreboard of the quiz
          round: '', //current round of a quiz
          teams: [
      
          ],
          currentPage: 'waiting',
          question: {
            number: 1,
            currentQuestion: '',
            category: ''
          },
      }
    }

    componentDidMount() {

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
  // .then(response => console.log(response));
  .then(response => this.setState({...this.state, teams: response }))
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
      <button onClick={this.getTeams}>Ophalen</button>
      <TableContent content={this.state.teams}></TableContent>
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
  if (this.state.currentPage == 'answers') {
    return <div className="App">
      <div className="container">
        <div className="col-12">
      <TableContent></TableContent>
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
