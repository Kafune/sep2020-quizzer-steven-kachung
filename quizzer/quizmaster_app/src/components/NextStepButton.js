import React from 'react';

class NextStepButton extends React.Component {
    handleButton = () => {
            this.props.handleButton();
     }
    render() {
        
      return <button onClick={this.handleButton}>Start new quiz night</button>
    }
  }
  export default NextStepButton;