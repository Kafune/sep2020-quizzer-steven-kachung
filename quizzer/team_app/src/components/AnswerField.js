import React from 'react'

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
            <div className="login">
            <label htmlFor="password"/>
                Fill in your answer <input
                type ="text"
                id ="anwer"
                onChange={this.handleAnswerChange}
             /> 
            <label/>
            <label/>
            <div className="dialogButtons">
                <button onClick={this.handleSaveAnswer}>Submit Answer</button>
                </div>
         </div>
        )
       }
    }
