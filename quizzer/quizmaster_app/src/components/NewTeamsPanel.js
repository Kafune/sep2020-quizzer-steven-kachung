import React from 'react';

class NewTeamsPanel extends React.Component {

    handleAcceptButton = () => {
        this.props.handleAcceptButton();
    }
    handleDenyButton = () => {
        this.props.handleDenyButton();
    }
    render() {
      const teams = this.props.teams.map((data) => {
      return <p key={data.name}>{data.name}</p>
      });
      return <React.Fragment>

          {teams}
       
        <button onClick={this.handleAcceptButton}>Accept Team</button>
        <button onClick={this.handleDenyButton}>Deny Team</button>
      </React.Fragment> 
    }
  }
  export default NewTeamsPanel;
