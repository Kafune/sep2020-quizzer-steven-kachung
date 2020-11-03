import React from 'react'
import { withRouter } from 'react-router-dom';
import Button from './childcomponents/Button';
import InputField from './childcomponents/InputField';
import QuestionInfo from './childcomponents/QuestionInfo';

class Answer extends React.Component{
    state = {
       answer: this.props.answer,
    };
    
    handleAnswerChange = (e) => {
         this.setState({ answer: e.target.value})
    }

    handleSaveAnswer = () => {
        this.props.saveAnswer({
            team: {
                ...this.props.data.team,
                answer: this.state.answer,
            }
        })
    }

    submitAnswer = () => {
        fetch('http://localhost:3000' + '/quiz/' +'5fa11f5e4b781b06bf3c342f'+ '/questions/answers', { // id moet opgehaald worden vanuit state
          method: 'PUT',
          mode: 'cors', 
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(  {
            team: "Steven", // moet opgehaald worden uit de state
            answer: this.state.answer
        })
        })
    }

    render() {
        return (
            <React.Fragment>
            <QuestionInfo currentQuestion={"Example question"}></QuestionInfo>
            <br></br>
            <div className="login">
            <InputField id="teamname" handleInput={this.handleAnswerChange} />
            <div className="dialogButtons">
            <Button text="Submit answer" clickEvent={this.submitAnswer}/>
            </div>
         </div>
         </React.Fragment>
        )
       }
    }
    export default withRouter(Answer);
