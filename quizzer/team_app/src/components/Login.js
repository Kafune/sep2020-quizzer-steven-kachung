import React from 'react'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { Link } from 'react-router-dom';
import { startLogin, getQuizInfo, openWebSocket, getWebSocket } from './../serverCommunication';

export default class Login extends React.Component {
   state = {
      ...this.props.data
   }

   componentDidMount() {
      let ws = openWebSocket();
      ws.onerror = () => { };
      ws.onopen = () => { console.log('connected') };
      ws.onclose = () => { };
      ws.onmessage = msg => (msg.data == 'register_team') ? console.log("getteams") : console.log(msg)
   }

   componentWillUnmount() {
      const ws = getWebSocket();
      
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
         .then(res => this.setState({
            quiz: {
               _id: res._id,
               password: res.password,
               round: res.round,
            },
            team: {
               teamname: res.teams._id,
               score: 0,
               status: res.teams.status
            }
         }, () => {
            const msg = {
               role: "client",
               room: this.state.quiz._id,
               request: "register_team"
            };
            const ws = getWebSocket();
            console.log(msg);
            ws.send(JSON.stringify(msg));
         }));

      //do the websocket stuff here
      

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
            {/* <Link to="/wait"> */}
            <Button text="Submit team" color="btn-primary" clickEvent={this.saveNewTeam} />
            {/* </Link> */}
         </div>
      )
   }
}
