import React from 'react';
import './App.css';
import Logo from './components/Logo'
import Login from './components/Login'
import QuestionInfo from './components/QuestionInfo'
import AnswerField from './components/AnswerField'
import Waiting from './components/Waiting'
import {Switch} from 'react-router-dom'
import {Route} from 'react-router-dom'


export class App extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
        team : {
          teamname: '',
          password: ''
        },
        answer: ''
     }
  }

  componentDidMount() {
     // Fetchen van o.a. vragen
     
   }

  saveNewTeam = (prefs) => {
    this.setState(
      {
        team:{
          teamname: prefs.teamname,
          password: prefs.password
        }
      }
    )
  }

  saveNewAnswer= (answer) => {
    this.setState( {
      answer: answer
    }
    )
  }

  render() {
    console.log(this.state)
     return  <div className="App">
          <Switch>
            <Route exact path="/">
              <Logo title={"Quizzer"} page={"Login"}></Logo>
              <Login saveNewTeam={this.saveNewTeam}></Login>
            </Route>
            <Route exact path="/quizzes">
              <Logo title={"Quizzer"} page="Question"></Logo>
              <QuestionInfo currentQuestion={"Example question"}></QuestionInfo>
              <AnswerField saveAnswer={this.saveNewAnswer}></AnswerField>
            </Route>
            <Route exact path="/wait">
              <Waiting waitmessage={"Waiting for other teams to join..."}></Waiting>
            </Route>
          </Switch>
       
    {/* <Logo title={"Quizzer"} page={"Login"}></Logo>     
    <Login saveNewTeam={this.saveNewTeam}></Login>
    <AnswerField saveAnswer={this.saveNewAnswer}></AnswerField>
    <QuestionInfo currentQuestion={"Example question"}></QuestionInfo> */}
 
  </div>
  }
}