import React from 'react';

class NewTeamsPanel extends React.Component {
      state = {
        name: '',
    };

    handleGetTeams = () => {
      this.props.handleGetTeams();
    }

    handleAcceptButton = () => {
        this.props.handleAcceptButton({
            name: this.state.name,  
        }
        );
    }
    handleDenyButton = () => {
        this.props.handleDenyButton();
    }
    handleOptions = (e) => {
      this.setState({ name: e.target.value})
  }
    
    render() {
      const teams = this.props.teams.map((data) => {
      return <option 
            onClick={this.handleOptions}
            key={data._id}>
            {data._id}
      </option>
      });
      return <React.Fragment>
      <button onClick={this.handleGetTeams}>Get new teams</button>
      <div className="form-group">
        <label htmlFor="teams">New teams</label>
        <select multiple className="form-control">
          {teams}
        </select>
      </div>
        <button onClick={this.handleAcceptButton}>Accept Team</button>
        <button onClick={this.handleDenyButton}>Deny Team</button>
      </React.Fragment> 
    }
  }
  export default NewTeamsPanel;
