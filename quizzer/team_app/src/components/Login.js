import React from 'react'

export default class Login extends React.Component{
   
    state = {
       teamname: '',
       password: ''
    };
  
    
    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value})
     }

    handleTeamChange = (e) => {
       this.setState({ teamname: e.target.value})
    }

    saveChanges = () => {
      this.props.saveNewTeam({
          teamname: this.state.teamname,
          password: this.state.password
      })
    }


    render() {
        return (
            <div className="login">
               <p>{this.props.teamname}</p>
            <label htmlFor="password"/>
               Fill in your room password <input
                type ="text"
                id ="password"
                onChange={this.handlePasswordChange}
             /> 
            <label/>
            <br></br>
            <label htmlFor="teamname"/>
               Fill in your team name <input
                type ="text"
                id ="teamname"
                onChange={this.handleTeamChange}
             /> 
            <label/>
            <div className="dialogButtons">
                <button onClick={this.saveChanges}>Submit Team</button>
                </div>
         </div>
        )
       }
    }
