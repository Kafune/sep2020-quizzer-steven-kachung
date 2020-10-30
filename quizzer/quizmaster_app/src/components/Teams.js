import React from 'react'
import Button from './childcomponent/Button';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './../ServerCommunication';
import Panel from './Panel';
import { Link } from 'react-router-dom';

export default class Teams extends React.Component {
    // state = {
    //   ...this.appState,
    //   selectedTeam: '',
    //   approvedTeams: []
    // }

  appState = this.props.data;

  componentDidMount() {
    let ws = getWebSocket();
    ws.onerror = () => { console.log('error') };
    ws.onopen = () => { console.log('connected') };
    ws.onclose = () => { };
    ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams() : console.log('ook hier')
   }

  handleInput = (data) => {
    this.setState({ selectedTeam: data })
  }

  fetchTeams = () => {
      //TODO: zet alle teams in de teams array.
      console.log(this.appState.quiz)
      getTeams(this.appState.quiz._id)
        .then(response => console.log(response))
        // .then(response => console.log(response)
        // .then(response => this.setState({ quiz: { ...this.appState.quiz, teams: response } }));
    }

    acceptTeam = () => {
      fetch('http://localhost:3000' + '/quiz/' + this.appState.quiz._id + '/teams/', {
        method: 'PUT',
        mode: 'cors', 
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": 'this.props.selectedTeam.name'
        })
      })
      .then(result => result.json())
      .then(result => this.getAcceptedTeams(result))
      .then(result => this.getAppliedTeams(result.teams))
      .then(response => this.setState({ quiz: { ...this.appState.quiz, teams: response } }))

      const msg = {
        role: "client",
        request: "accept_team"
      };
      const ws = getWebSocket();
      ws.send(JSON.stringify(msg));
      
  }

  denyTeam = () => {
    fetch('http://localhost:3000' + '/quiz/' + this.appState.quiz._id + '/teams/', {
      method: 'DELETE',
      mode: 'cors', 
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": 'this.props.selectedTeam.name'
      })
    })
    .then(result => result.json())
    .then(response => this.getAppliedTeams(response.teams))
    .then(response => this.setState({ quiz: { ...this.appState.quiz, teams: response } }))

    const msg = {
      role: "client",
      request: "deny_team"
    };
    const ws = getWebSocket();
    ws.send(JSON.stringify(msg));
  }

  getAppliedTeams = (data) => {
    const items = data.filter(data => {     
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

   render() {
     console.log(this.appState);
      return (     
        (this.appState.quiz._id) 
        ?  <div>
        <div className="container">
          <div className="row">
           <div className="col-12">
            <h2 className="text-center">Room password: {this.appState.quiz.password}</h2> 
            </div>
          </div>
           <div className="row">
             <div className="col-6">
             <Panel
               title={'Applied Teams'}
               items={this.appState.quiz.teams}
               handleInput={this.handleInput}
               >
             </Panel>
             <Button text="Accept Team" color="btn-success" clickEvent={this.acceptTeam}/>
             <Button text="Deny Team" color="btn-danger" clickEvent={this.denyTeam}/>
             </div>
             <div className="col-6">
             <Panel
               title={'Approved teams'}
               items={this.appState.quiz.approvedTeams}
               handleInput={this.handleInput}
               >
             </Panel>
               </div>
           </div>
           <div className="row">
                 <div className="col-12">
                 <Link to="/quiz/select-categories">
                   <Button text="Select categories" color="btn-primary"></Button>
                </Link>
                 </div>
               </div>
         </div>
      </div>
        : <div>Er is nog geen quiz aangemaakt!</div>

      )
   }
}