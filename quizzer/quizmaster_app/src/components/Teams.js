import React from 'react'
import Button from './childcomponent/Button';
import { getWebSocket, startQuiz, getTeams } from './../ServerCommunication';
import Panel from './Panel';
import { withRouter } from 'react-router-dom';

 class Teams extends React.Component {
    state = {
      teams: [],
      selectedTeam: '',
      approvedTeams: []
    }

  appState = this.props.appState;

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
      getTeams(this.appState.quiz._id)
        .then(response => this.getAppliedTeams(response))
        .then(response => this.setState({teams: response  }))
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
          "name": this.state.selectedTeam.name
        })
      })
      .then(result => result.json())
      .then(result => this.getAcceptedTeams(result))
      .then(result => this.getAppliedTeams(result.teams))
      .then(response => this.setState({...this.state, teams: response }))

      // const msg = {
      //   role: "quizmaster",
      //   request: "accept_team"
      // };
      // const ws = getWebSocket();
      // ws.send(JSON.stringify(msg));   
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
        "name": this.state.selectedTeam
      })
    })
    .then(result => result.json())
    .then(response => this.getAppliedTeams(response.teams))
    .then(response => console.log(response))

    const msg = {
      role: "quizmaster",
      teamname: this.state.selectedTeam,
      quiz_id: this.appState.quiz._id,
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

  teststate = () => {
    console.log(this.state)
  }

  nextStep = () => {
    const data= {
      quiz: {
        ...this.appState.quiz,
        teams: this.state.teams,
        approvedTeams: this.state.approvedTeams
      }
    }
    this.props.newState(data);

    // console.log(this.state.approvedTeams)

    const msg = {
      role: "quizmaster",
      approvedTeams: this.state.approvedTeams,
      quiz_id: this.appState.quiz._id,
      request: "start_round"
    };
    const ws = getWebSocket();
    ws.send(JSON.stringify(msg));

    this.props.history.push('/quiz/select-categories')
 }

   render() {
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
               items={this.state.teams.map(data => {return data._id})}
               handleInput={this.handleInput}
               >
             </Panel>
             <Button text="Accept Team" color="btn-success" clickEvent={this.acceptTeam}/>
             <Button text="Deny Team" color="btn-danger" clickEvent={this.denyTeam}/>
             <Button text="Ophalen Teams" color="btn-danger" clickEvent={this.teststate}/>
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
                    <Button text="Start Round" clickEvent={this.nextStep}></Button>
                 </div>
               </div>
         </div>
      </div>
        : <div>Er is een probleem opgetreden met de server, waardoor de quiz niet aangemaakt kon worden!</div>

      )
   }
}

export default withRouter(Teams);