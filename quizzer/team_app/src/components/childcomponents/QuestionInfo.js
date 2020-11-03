import React from 'react'

class QuestionInfo extends React.Component {
    render() {
      return <React.Fragment>
        <h3>{this.props.currentQuestion}</h3>
      </React.Fragment> 
    }
  }
  export default QuestionInfo;