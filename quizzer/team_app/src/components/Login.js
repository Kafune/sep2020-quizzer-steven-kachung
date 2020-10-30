import React from 'react'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { Link } from 'react-router-dom';
import { startLogin, getQuizInfo, openWebSocket, getWebSocket } from './../serverCommunication';

export default class Login extends React.Component {

   appState = this.props.data;
   
   state = {
      teamname: '',
      password: ''
   }


   componentDidMount() {
      let ws = openWebSocket();
      ws.onerror = () => { };
      ws.onopen = () => { console.log('connected') };
      ws.onclose = () => { };
      ws.onmessage = msg => (msg.data == 'register_team') ? console.log("getteams") : console.log(msg)
   }

   componentWillUnmount() {
      // const ws = getWebSocket();
      
   }

   handlePasswordChange = (e) => {
      this.setState({
         ...this.appState,
         quiz: {
            password: e.target.value
         }
      }, () => {
         // console.log(this.appState.quiz)
      })
   }

   handleTeamChange = (e) => {
      this.setState({
         teamname: e.target.value
      }, () => {
         console.log(this.state.teamname)
         this.props.changeInputValue();
      })
      // this.setState({
      //    ...this.appState,
      //    team: {
      //       teamname: e.target.value
      //    }
      // }, () => {
      //    console.log(this.appState.team.teamname)
      // });
   }

   saveNewTeam = () => {
      console.log(this.appState)
      console.log(this.state.teamname);
      getQuizInfo(this.appState.quiz.password)
      .then(res => console.log(res))
         // .then(res => startLogin(this.appState.team.teamname, this.appState.quiz.password, res._id))
         // .then(res => 
         //    this.setState({
         //    quiz: {
         //       _id: res._id,
         //       password: res.password,
         //       round: res.round,
         //    },
         //    team: {
         //       teamname: res.teams[res.teams.length - 1]._id,
         //       score: 0,
         //       status: res.teams[res.teams.length - 1].status
         //    }}
         // , () => {
         //    const msg = {
         //       role: "client",
         //       request: "register_team"
         //    };
         //    const ws = getWebSocket();
         //    console.log(msg);
         //    ws.send(JSON.stringify(msg));


         // })
         // )
         // .then(() => this.fetchNewState())

      //do the websocket stuff here
      

   }

   componentDidMount() {
      //post teamnaam naar de server toe
   }

   fetchNewState = () => {
      this.props.newState(this.appState);
   }

   render() {
      return (
         <div className="login">
            <p>{this.props.teamname}</p>
            <InputField text="Fill in your room password" id="password" handleInput={this.handlePasswordChange} />
            <br></br>
            <InputField text="Fill in your team name" id="teamname" handleInput={this.handleTeamChange} />
            {/* <Link to="/quiz"> */}
            <Button text="Submit team" color="btn-primary" clickEvent={this.saveNewTeam} />
            {/* </Link> */}
         </div>
      )
   }
}
