import React from "react";
import { getTeams, getNewAnswerResult, getResults } from "./ServerCommunication";
import "./App.css";
import TeamsOverview from "./components/TeamsOverview";
import TeamsAnswering from "./components/TeamsAnswering";
import TeamResult from "./components/TeamResult";
import EndResult from "./components/EndResult";
import Login from "./components/Login";
import WaitingScreen from "./components/WaitingScreen";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      password: "",
      quizInfoVisible: true,
      round: "",
      teams: [],
      currentPage: "login",
      teams_answered: [],
      answer_results: [],
      round_score: [],
      question: {
        number: 1,
        currentQuestion: "",
        category: "",
      },
    };
  }

  setNewState = (data) => {
    this.setState(data);
  };

  requestTeams = () => {
    getTeams(this.state._id).then((response) =>{
      this.setState({ ...this.state, teams: response })
    }
    );
  };

  getAcceptedTeams = (data) => {
    const items = data.filter((data) => {
      return data.status == "accepted";
    });
    return items;
  };

  getTeamsWhoAnswered = () => {
    getTeams(this.state._id)
      .then((response) => this.filterWhoHasAnswered(response))
      .then((response) =>
        this.setState({ ...this.state, teams_answered: response })
      );
  };

  filterWhoHasAnswered = (teams) => {
    const items = teams.filter((data) => {
      return data.answer != "";
    });
    return items;
  };

  //Get answer results
  requestNewAnswerResult = (result) => {
    getNewAnswerResult(this.state._id)
      .then((response) => this.filterOnTeamname(response, result.teamname))
      .then((response) =>
        this.setState({
          ...this.state,
          answer_results: [
            ...this.state.answer_results,
            {
              name: response[response.length - 1]._id,
              answer: response[response.length - 1].answer,
              result: result.correct_answer,
            },
          ],
        })
      );
  };

  filterOnTeamname = (teams, search) => {
    const items = teams.filter((data) => {
      return data._id == search;
    });
    return items;
  };

  requestResults = () => {
      getResults(this.state._id)
      .then((response) => this.filterScore(response.teams))
      .then((result) => {
        this.setState({
          ...this.state,
          round_score: result,
        })
      })
  };

  filterScore = (info) => {
    const items = info.map((data) => {
      return data;
    });
    let sortedArray = items.sort(
      (team, team2) => parseFloat(team2.score) - parseFloat(team.score)
    );
    return sortedArray
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>Scoreboard</h1>
          {this.state.currentPage == "waiting" ? (
            <WaitingScreen
              appState={this.state}
              newState={this.setNewState}
              requestTeams={this.requestTeams}
              text="Waiting for quizmaster to start..."
            ></WaitingScreen>
          ) : (
            ""
          )}
          {this.state.currentPage == "teams_answering" ? (
            <TeamsAnswering
              content={this.state.teams_answered}
              appState={this.state}
              newState={this.setNewState}
              getTeamsWhoAnswered={() => this.getTeamsWhoAnswered()}
            ></TeamsAnswering>
          ) : (
            ""
          )}
          {this.state.currentPage == "teams_overview" ? (
            <TeamsOverview
              content={this.state.teams}
              appState={this.state}
              newState={this.setNewState}
              requestTeams={this.requestTeams}
            ></TeamsOverview>
          ) : (
            ""
          )}
          {this.state.currentPage == "answer_result" ? (
            <TeamResult
              content={this.state.answer_results}
              getNewAnswerResult={this.requestNewAnswerResult}
              appState={this.state}
              newState={this.setNewState}
              requestTeams={this.requestTeams}
              requestResults={this.requestResults}
            ></TeamResult>
          ) : (
            ""
          )}
          {this.state.currentPage == "end_round" ? (
            <EndResult
            content={this.state.teams}
              appState={this.state}
              newState={this.setNewState}
              requestTeams={this.requestTeams}
            ></EndResult>
          ) : (
            ""
          )}
          {this.state.currentPage == "login" ? (
            <Login
              appState={this.state}
              newState={this.setNewState}
              startQuiz={this.startQuiz}
            ></Login>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default App;
