import React from 'react'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { withRouter } from 'react-router-dom';
import { startLogin, getQuizInfo, openWebSocket, getWebSocket } from './../serverCommunication';


class Login extends React.Component {
   state = {
      teamname: '',
      password: ''
   }


   componentDidMount() {

   }

   componentWillUnmount() {
      // const ws = getWebSocket();

   }

   handlePasswordChange = (e) => {
      this.setState({
         password: e.target.value
      }, () => {
         console.log(this.state.password)
      })
   }

   handleTeamChange = (e) => {
      this.setState({
         teamname: e.target.value
      }, () => {
         console.log(this.state.teamname)
      })
   }

   saveNewTeam = () => {
      //open de websocket
      let ws = openWebSocket();
      ws.onerror = () => { };
      ws.onopen = () => { console.log('connected') };
      ws.onclose = () => { };
      ws.onmessage = msg => (msg.data == 'register_team') ? console.log("getteams") : console.log(msg)

      console.log(this.state.teamname);
      getQuizInfo(this.state.password)
         .then(res => startLogin(this.state.teamname, this.state.password, res._id))
         .then(res => this.setNewState({
            quiz: {
               _id: res._id,
               password: res.password,
               round: res.round.number,
               questionNumber: 1
            },
            team: {
               teamname: res.teams[res.teams.length - 1]._id,
               score: 0,
               status: res.teams[res.teams.length - 1].status
            },
            answer: ''
         }))
         .then(() => {
            //do the websocket stuff here
            const msg = {
               role: "client",
               teamname: this.state.teamname,
               quiz_id: this.props.data.quiz._id,
               request: "register_team"
            };
            const ws = getWebSocket();
            console.log(msg);
            ws.send(JSON.stringify(msg));
         })
         .then(() => this.props.history.push('/quiz/team/edit'))
         .catch(() => {
            throw new Error("Something went wrong while trying to get in the quiz!")
         })



   }

   componentDidMount() {
      //post teamnaam naar de server toe
      
   }

   setNewState = (data) => {
      this.props.newState(data);
   }

   render() {
      return (
         <div className="login">
            <p>{this.props.teamname}</p>
            <InputField text="Fill in your room password" id="password" handleInput={this.handlePasswordChange} />
            <br></br>
            <InputField text="Fill in your team name" id="teamname" handleInput={this.handleTeamChange} />
            <Button text="Submit team" color="btn-primary" clickEvent={this.saveNewTeam} />
         </div>
      )
   }
}

export default withRouter(Login);