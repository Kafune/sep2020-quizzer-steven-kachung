import React from 'react';
import Question from './childcomponent/Question'
import Button from './childcomponent/Button'
import QuizInformation from './childcomponent/QuizInformation';

class QuestionPanel extends React.Component {

    render() {
      return <React.Fragment>
        <QuizInformation></QuizInformation>
        <h2>Select a question</h2>
        <Button text="Get new questions" color="btn-success pull-right" clickEvent={this.fetchTeams}/>
        <Question question={"Which famous group performed the first ever song on Top Of the Pops in 1964?"} category={"Music"}></Question>
        <Question question={"Which famous group performed the first ever song on Top Of the Pops in 1964?"} category={"History"}></Question>
        <Question question={"Which famous group performed the first ever song on Top Of the Pops in 1964?"} category={"Art"}></Question>
      </React.Fragment>
    }
  }
  export default QuestionPanel;
  