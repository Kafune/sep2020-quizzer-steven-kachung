import React from 'react'

class ResultPanel extends React.Component {
    render() {
    // Fetch a new question
      return <React.Fragment>
        <h3>{this.props.currentQuestion}</h3>
      </React.Fragment> 
    }
  }
  export default QuestionInfo;