
import React from 'react'
import Button from './childcomponent/Button';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './../ServerCommunication';
import Panel from './Panel';
import { useHistory } from "react-router-dom";

export default class Teams extends React.Component {
    state = {
      ...this.props.data,
      selectedTeam: '',
      approvedTeams: []
    }

  componentDidMount() {
    
   }

  handleInput = (data) => {
    this.setState({ selectedTeam: data })
  }

  fetchTeams = () => {
      //TODO: zet alle teams in de teams array.
      getTeams(this.state.quiz._id)
        .then(request => request.json())
        .then(response => this.setState({ quiz: { ...this.state.quiz, teams: response } }));
    }

    acceptTeam = () => {
      fetch('http://localhost:3000' + '/quiz/' + this.state.quiz._id + '/teams/', {
        method: 'PUT',
        mode: 'cors', 
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": this.state.selectedTeam.name
        })
      })
      .then(result => result.json())
      .then(result => this.getAcceptedTeams(result))
      .then(info => this.getAppliedTeams(info))
      .then(response => this.setState({ quiz: { ...this.state.quiz, teams: response } }))
      // console.log(this.state)

      // .then(result => result.json())
      // .then(info => this.getAppliedTeams(info))
      // .then(response => this.setState({ quiz: { ...this.state.quiz, teams: response.teams } }))
      // .then(() => this.getAcceptedTeams());
  
  }

  getAppliedTeams = (data) => {
    const items = data.teams.filter(data => {     
      return data.status == 'not_accepted';
    });
    return items;
  }

  getAcceptedTeams = (data) => {
    const items = data.teams.filter(data => {     
      return data.status == 'accepted';
    });
    this.setState({...this.state, approvedTeams: items})
    return data
  }

  denyTeam = () => {
    console.log("Deny current team")
  }
   render() {
          

        
      return (     
        (this.state.quiz._id) 
        ?  <div>
        <div className="container">
          <div className="row">
           <div className="col-12">
            <h2 className="text-center">Room password: {this.state.quiz.password}</h2> 
            </div>
          </div>
          <div className="row">
            <div className="col-12">
          <Button text="Get teams" color="btn-primary" clickEvent={this.fetchTeams}/>
          </div>
          </div>
           <div className="row">
             <div className="col-6">
             <Panel
               title={'Applied Teams'}
               items={this.state.quiz.teams}
               handleInput={this.handleInput}
               >
             </Panel>
             <Button text="Accept Team" color="btn-success" clickEvent={this.acceptTeam}/>
             <Button text="Deny Team" color="btn-danger" clickEvent={this.denyTeam}/>
             <Button text="Get accepted teams" color="btn-danger" clickEvent={this.getAcceptedTeams}/>
             </div>
             <div className="col-6">
             <Panel
               title={'Approved teams'}
               items={this.state.approvedTeams}
               handleInput={this.handleInput}
               >
             </Panel>
               </div>
           </div>
           <div className="row">
                 <div className="col-12">
                   <Button text="Select categories" color="btn-primary"></Button>
                 </div>
               </div>
         </div>
      </div>
        : <div>Er is nog geen quiz aangemaakt!</div>

      )
   }
}