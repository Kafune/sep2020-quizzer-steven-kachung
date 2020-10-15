import React from 'react';
import './App.css';
import RoomPanel from'./components/RoomPanel'
import NewTeamsPanel from'./components/NewTeamsPanel'


export class App extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
        roompassword: '1234',
        teams: [],
        items: []
     }
  }

  componentDidMount() {
     // Fetchen van teams
    //  this.setState({teams: ['Blue','Red','Test']} 
    //   );
    fetch('http://localhost:3000/quiz/', {
      method: 'POST', credentials: 'include', mode: 'cors'
    })
      
   }


  render() {
     return  <div className="App">
       <div className="header"></div>
      <RoomPanel password={this.state.roompassword}></RoomPanel>
      <NewTeamsPanel teams={this.state.teams}></NewTeamsPanel>
 
  </div>
  }
}