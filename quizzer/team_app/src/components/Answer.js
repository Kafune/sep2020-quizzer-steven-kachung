import React from 'react'
import Button from './childcomponents/Button';
import QuestionInfo from './childcomponents/QuestionInfo';

export default class AnswerField extends React.Component{
    state = {
       answer: this.props.answer,
    };
    
    handleAnswerChange = (e) => {
         this.setState({ answer: e.target.value})
    }

    handleSaveAnswer = (e) => {
        this.props.saveAnswer({
            answer: this.state.answer,
        })
    }

    render() {
        return (
            <React.Fragment>
            <QuestionInfo currentQuestion={"Example question"}></QuestionInfo>
            <br></br>
            <div className="login">
            <label htmlFor="password"/>
                Fill in your answer <input
                type ="text"
                id ="anwer"
                onChange={this.handleAnswerChange}
             /> 
            <label/>
            <div className="dialogButtons">
                <Button text="Submit answer" onClick={this.handleSaveAnswer}/>
                </div>
         </div>
         </React.Fragment>
        )
       }
    }
