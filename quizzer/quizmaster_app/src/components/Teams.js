import React from 'react'
import Button from './childcomponent/Button';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from './../ServerCommunication';
import Panel from './Panel';
import { Link } from 'react-router-dom';

export default class Teams extends React.Component {
    state = {
      ...this.props.data,
      selectedTeam: '',
      approvedTeams: []
    }

  componentDidMount() {
    let ws = getWebSocket();
    ws.onerror = () => { console.log('error') };
    ws.onopen = () => { console.log('connected') };
    ws.onclose = () => { };
    // ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg.data)
    ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams() : console.log('ook hier')
   }

  handleInput = (data) => {
    this.setState({ selectedTeam: data })
  }

  fetchTeams = () => {
      //TODO: zet alle teams in de teams array.
      getTeams(this.state.quiz._id)
        .then(request => request.json())
        .then(response => this.getAppliedTeams(response))
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
      .then(result => this.getAppliedTeams(result.teams))
      .then(response => this.setState({ quiz: { ...this.state.quiz, teams: response } }))

      const msg = {
        role: "client",
        request: "accept_team"
      };
      const ws = getWebSocket();
      ws.send(JSON.stringify(msg));   
  }

  denyTeam = () => {
    fetch('http://localhost:3000' + '/quiz/' + this.state.quiz._id + '/teams/', {
      method: 'DELETE',
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
    .then(response => this.getAppliedTeams(response.teams))
    .then(response => this.setState({ quiz: { ...this.state.quiz, teams: response } }))

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
             <div className="col-6">
             <Panel
               title={'Applied Teams'}
               items={this.state.quiz.teams.map(data => {return data._id})}
               handleInput={this.handleInput}
               >
             </Panel>
             <Button text="Accept Team" color="btn-success" clickEvent={this.acceptTeam}/>
             <Button text="Deny Team" color="btn-danger" clickEvent={this.denyTeam}/>
             </div>
             <div className="col-6">
             <Panel
               title={'Approved teams'}
               items={this.state.approvedTeams.map(data => {return data._id})}
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