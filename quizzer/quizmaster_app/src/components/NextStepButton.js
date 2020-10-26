import React from 'react';

class NextStepButton extends React.Component {
    handleButton = () => {
        this.props.handleButton();
     }
    render() {
        
      return <button onClick={this.handleButton}>{this.props.buttonText}</button>
    }
  }
  export default NextStepButton;