import React from 'react'
import Button from './childcomponent/Button';
import NewTeamsPanel from './NewTeamsPanel';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './../ServerCommunication';
import RoomPanel from './RoomPanel';

export default class Teams extends React.Component {
    state = {
        ...this.props.quiz
    }

   componentDidMount() {
      
   }
   fetchTeams = () => {
    //TODO: zet alle teams in de teams array.
    // console.log(this.state.quiz);
    getTeams(this.state._id)
      .then(request => request.json())
      .then(response => this.setState({ quiz: { ...this.state, teams: response } }));
      console.log(this.state);
  }

acceptTeam = (data) => {
     fetch('http://localhost:3000/quiz/5f8987db6749d52d1ccf0996/teams/', {
      method: 'PUT',
      mode: 'cors', 
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": data.name
      })
    });
}


denyTeam = () => {
  console.log("Deny current team")
}


   render() {
       console.log(this.state);
      return (
          
         <div>
             <h2>Room password: {this.state.password}</h2>
            {/* <Button text="Get teams" color="btn-primary" clickEvent={this.fetchTeams}/>
             <NewTeamsPanel
                handleGetTeams={this.fetchTeams}
                handleAcceptButton={this.acceptTeam}
                handleDenyButton={this.denyTeam}
                teams={this.state.teams}>
          </NewTeamsPanel> */}
         </div>
      )
   }
}
