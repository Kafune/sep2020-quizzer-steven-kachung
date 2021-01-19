import React from "react";
import { openWebSocket, getWebSocket } from "./ServerCommunication";
import "./App.css";
import TableContent from "./components/TableContent";
import List from "./components/List";
import TeamResult from "./components/TeamResult";
import EndResult from "./components/EndResult";
import WaitingScreen from "./components/WaitingScreen";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      round: "",
      teams: [],
      currentPage: "start",
      teams_answered: [],
      answer_results: [],
      question: {
        number: 1,
        currentQuestion: "",
        category: "",
      },
    };
  }

  componentDidMount() {
    const ws = openWebSocket();
    ws.onerror = () => {
      console.log("error");
    };
    ws.onopen = () => {
      console.log("connected");
    };
    ws.onclose = () => {};
    ws.onmessage = (msg) => {
      console.log(msg);
      if (this.checkJson(msg.data)) {
        const message = JSON.parse(msg.data);
        if (message.subject == "new_answer_result") {
          this.getNewAnswerResult(message.teamname, message.correct_answer);
        }
      } else {
        console.log(msg.data);
        switch (msg.data) {
          case "new_quiz":
            if (!this.state._id) {
              console.log("nieuwe quiz in state");
              this.startQuiz();
            }
            break;
          case "select_question":
            if (this.state._id) {
              this.setState({
                _id: this.state._id,
                round: this.state.round,
                teams: this.state.teams,
                currentPage: "teams_answering",
                teams_answered: [],
                answer_results: [],
                question: {
                  number: 1,
                  currentQuestion: "",
                  category: "",
                },
              });
            }
            this.getTeams();
            break;
          case "select_category":
            if (this.state._id) {
              console.log("categorie aan het selecteren");
              this.startQuiz();
            }
            break;

          case "quiz_started":
            if (this.state._id) {
              console.log("quiz is begonnen");
              this.setState({ ...this.state, currentPage: "teams_answering" });
              break;
            }
          case "new_answer":
            console.log("nieuw antwoord is gegeven");
            this.getTeamsWhoAnswered();
            break;
          case "closed_question":
            console.log("overzicht van resultaat op vraag");
            this.setState({ ...this.state, currentPage: "answer_result" });
            break;

          case "end_game":
            console.log("Einde game");
            this.setState({ ...this.state, currentPage: "end_game" });
            this.getTeams();
            this.filterScore();
            break;
          default:
            console.log("onbekend bericht");
            console.log(msg.data);
        }
      }
    };
  }

  checkJson = (message) => {
    try {
      JSON.parse(message);
    } catch {
      return false;
    }
    return true;
  };

  getQuiz = () => {
    fetch("http://localhost:3000" + "/quiz/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((response) => this.getLastItem(response))
      .then((response) =>
        this.setState({
          ...this.state,
          _id: response._id,
          round: response.round.number,
        })
      )
      .then(() => {
        //Dit zorgt ervoor dat scoreboard bekend is voor de websockets
        const msg = {
          role: "scoreboard",
          request: "",
          quiz_id: this.state._id,
        };
        const ws = getWebSocket();
        ws.send(JSON.stringify(msg));
      });
  };

  getLastItem = (data) => {
    return data[data.length - 1];
  };

  getTeams = () => {
    fetch("http://localhost:3000" + "/quiz/" + this.state._id + "/teams/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((response) => this.setState({ ...this.state, teams: response }));
  };

  getAcceptedTeams = (data) => {
    const items = data.filter((data) => {
      return data.status == "accepted";
    });
    return items;
  };


  startQuiz = () => {
    this.setState({ ...this.state, currentPage: "teams_overview" });
    this.getTeams();
    // this.getcurrentQuestion();
  };

  //Which has already answered a question
  getTeamsWhoAnswered = () => {
    fetch("http://localhost:3000" + "/quiz/" + this.state._id + "/teams/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    })
      .then((response) => response.json())
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

  getNewAnswerResult = (teamname, result) => {
    fetch("http://localhost:3000" + "/quiz/" + this.state._id + "/teams/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((response) => this.filterOnTeamname(response, teamname))
      .then((response) =>
        this.setState({
          ...this.state,
          answer_results: [
            ...this.state.answer_results,
            {
              name: response[response.length - 1]._id,
              answer: response[response.length - 1].answer,
              result: result,
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

  filterScore = () => {
    const items = this.state.teams.map((data) => {
      return data.score;
    });

    let sortedArray = items.sort(
      (team, team2) => parseFloat(team2.score) - parseFloat(team.score)
    );
    console.log(items);
    console.log(sortedArray);
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>Scoreboard</h1>
          {this.state.currentPage == "start" ? (
            <WaitingScreen text="Waiting for quizmaster to start..."></WaitingScreen>
          ) : (
            ""
          )}
          {(this.state.currentPage == 'select_category') ? <WaitingScreen text="Quizmaster is selecting a new category and question..."></WaitingScreen> :"" }
          {(this.state.currentPage == "teams_answering") ? <List content={this.state.teams_answered}></List> : ""}
          {(this.state.currentPage == "teams_overview") ? <TableContent content={this.state.teams}></TableContent> : ""}
          {(this.state.currentPage == 'answer_result') ? <TeamResult content={this.state.answer_results}></TeamResult> : ""}
          {(this.state.currentPage == 'end_game') ? <EndResult appState={this.state}></EndResult> : ""}
        </div>
      </div>
    );
    
    // Next question moet teams_overview worden

    // if (this.state.currentPage == 'select_category') {
    //   return <WaitingScreen text="Quizmaster is selecting a new category and question..."></WaitingScreen>
    // }

    // if (this.state.currentPage == 'teams_answering') {
    //   return <div className="App">
    //     <div className="container">
    //       <div className="col-12">
    //       <h1>Quizzer</h1>
    //         <List content={this.state.teams_answered}></List>
    //       </div>
    //     </div>
    //   </div>
    // }

    // if (this.state.currentPage == 'answers') {
    //   return <div className="App">
    //     <div className="container">
    //       <div className="col-12">
    //       <h1>Quizzer</h1>
    //         <TableContent content={this.state.teams}></TableContent>
    //       </div>
    //     </div>
    //   </div>
    // }

    // if (this.state.currentPage == 'answer_result') {
    //   return <div className="App">
    //       <h1>Quizzer</h1>
    //         <TeamResult content={this.state.answer_results}></TeamResult>
    //       </div>
    // }

    // if (this.state.currentPage == 'end_game') {
    //   return <div className="App">
    //       <h1>Quizzer</h1>
    //        <EndResult appState={this.state}></EndResult>
    //       </div>

    // }
    // return (
    //   <div className="App">
    //     <h1>Quizzer</h1>
    //     <TableContent key={this.state._id} content={this.state.teams}></TableContent>
    //   </div>
    // );
  }
}

export default App;
