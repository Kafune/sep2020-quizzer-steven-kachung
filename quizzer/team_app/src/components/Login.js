import React from 'react'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import {startLogin, getQuizInfo} from './../serverCommunication';

export default class Login extends React.Component {
   state = {
      ...this.props.data
   }

   componentDidMount() {
      // let ws = openWebSocket();
      // ws.onerror = () => { };
      // ws.onopen = () => { console.log('connected') };
      // ws.onclose = () => { };
      // ws.onmessage = msg => (msg.data == 'get_teams') ? this.fetchTeams : console.log(msg)
   }

   handlePasswordChange = (e) => {
      this.setState({
         ...this.state.data,
         quiz: {
            password: e.target.value
         }
      }, () => {
         console.log(this.state.quiz)
      })
   }

   handleTeamChange = (e) => {
      this.setState({
         ...this.state.data,
         team: {
            teamname: e.target.value
         }
      }, () => {
         console.log(this.state.team)
      });
   }

   saveNewTeam = () => {
      getQuizInfo(this.state.quiz.password)
      .then(res => startLogin(this.state.team.teamname, this.state.quiz.password, res._id))
      .then(res => console.log(res))

      //do the websocket stuff here
      
   }

   saveChanges = () => {
      this.saveNewTeam({
         teamname: this.state.team.teamname,
         password: this.state.quiz.password
      })
      console.log(this.state.team);
   }

   componentDidMount() {
      //post teamnaam naar de server toe
   }

   render() {
      return (
         <div className="login">
            <p>{this.props.teamname}</p>
            <InputField text="Fill in your room password" id="password" handleInput={this.handlePasswordChange} />
            <br></br>
            <InputField text="Fill in your team name" id="teamname" handleInput={this.handleTeamChange} />
            <Button text="Submit team" color="btn-primary" clickEvent={this.saveChanges} />
         </div>
      )
   }
}
