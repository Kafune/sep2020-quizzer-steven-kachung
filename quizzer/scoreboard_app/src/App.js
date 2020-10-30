import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    _id: '', //scoreboard of the quiz
    round: '', //current round of a quiz
    teams: [],
    question: {
      number: 1,
      currentQuestion: '',
      category: ''
    },
    teamsAnswered: [] //teams that have answered the question

  });

  /*
    teams: {
      _id: string,
      ranking: current position of a team
      score: current score of a team
      answer: {
        currentAnswer: answer of team,
        approved: quizmaster approval of answer - ''
      }
      status: approved teams by quizmaster

      
    }
  */

  useEffect(() => {
    setIsLoading(false)
  })

  if (isLoading) {
    return <div className="App">
      <h1>Waiting for a quiz to start...</h1>
    </div>
  }

  return (
    <div className="App">
      <h1>Quizzer</h1>
    </div>
  );
}

export default App;
