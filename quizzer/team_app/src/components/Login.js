import React from 'react'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';

export default class Login extends React.Component {

   state = {
      teamname: '',
      password: ''
   };


   handlePasswordChange = (e) => {
      this.setState({ password: e.target.value })
   }

   handleTeamChange = (e) => {
      this.setState({ teamname: e.target.value })
   }

   saveChanges = () => {
      this.props.saveNewTeam({
         teamname: this.state.teamname,
         password: this.state.password
      })
   }

   componentDidMount() {
      //post teamnaam naar de server toe
   }

   render() {
      return (
         <div className="login">
            <p>{this.props.teamname}</p>
            <InputField text="Fill in your room password" id="password" onChange={this.handlePasswordChange} />
            <br></br>
            <InputField text="Fill in your team name" id="teamname" onChange={this.handleTeamChange} />

            <Button text="Submit team" color="btn-primary" clickEvent={this.saveChanges}/>
         </div>
      )
   }
}
