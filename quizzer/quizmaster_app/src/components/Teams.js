import React from 'react'
import Button from './childcomponent/Button';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './../ServerCommunication';
import Panel from './Panel';

export default class Teams extends React.Component {
    state = {
      ...this.props.data,
      selectedTeam: ''
    }

  componentDidMount() {

   }

  handleInput = (data) => {
    this.setState({ selectedTeam: data })
  }

  fetchTeams = () => {
      //TODO: zet alle teams in de teams array.
      // console.log(this.state.quiz);
      getTeams(this.state.quiz.id)
        .then(request => request.json())
        .then(response => this.setState({ quiz: { ...this.state, teams: response } }));
        console.log(this.state);
    }

  acceptTeam = () => {
      fetch('http://localhost:3000' + '/quiz/' + this.state.quiz.id + '/teams/', {
        method: 'PUT',
        mode: 'cors', 
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": this.state.selectedTeam.name
        })
      }).then(result => console.log(result));
  }

  denyTeam = () => {
    console.log("Deny current team")
  }
   render() {
     console.log(this.state)
      return (     
         <div>
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
                </div>
                <div className="col-6">
                <Panel
                  title={'Approved teams'}
                  items={this.state.quiz.teams}
                  handleInput={this.handleInput}
                  >
                </Panel>
                  </div>
              </div>
            </div>
         </div>
      )
   }
}
