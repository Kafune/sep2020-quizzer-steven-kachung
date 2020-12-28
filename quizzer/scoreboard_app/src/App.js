import React from "react";
import {
  openWebSocket,
  getWebSocket,
  login,
  getQuiz,
} from "./ServerCommunication";
import "./App.css";
import TableContent from "./components/TableContent";
import List from "./components/List";
import TeamResult from "./components/TeamResult";
import EndResult from "./components/EndResult";
import Login from "./components/Login";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setupWebsocket: false,
      _id: "",
      round: "",
      teams: [],
      currentPage: "login",
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
    
    if(this.state.setupWebsocket == true) {
      this.setupNewWebsocket()
    }
    };

savePrefsWebsocket = () => {
  this.setState({...this.state, setupWebsocket: true,})
}

setupNewWebsocket = () => {
  console.log("hoi")
  const ws = getWebSocket();
  ws.onerror = () => {
    console.log("error");
  };
  ws.onopen = () => {
    console.log("connected");
  };
  ws.onclose = () => {};
  ws.onmessage = (msg) => {
    if (this.checkJson(msg.data)) {
      const message = JSON.parse(msg.data);
      if (message.subject == "new_answer_result") {
        this.getNewAnswerResult(message.teamname, message.correct_answer);
      }
    } else {
      switch (msg.data) {
        case "next_question":
          if (this.state._id) {
            console.log("Vraag aan het selecteren");
            this.setState({
              _id: this.state._id,
              round: this.state.round,
              teams: this.state.teams,
              currentPage: "answer",
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
            this.setState({
              ...this.state,
              currentPage: "teams_answering",
            });
          }
          break;
        case "new_answer":
          console.log("nieuw antwoord is gegeven");
          this.getTeamsWhoAnswered();
          break;

        case "answer_result":
          console.log("overzicht van resultaat op vraag");
          this.setState({ ...this.state, currentPage: "answers_result" });
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
    }}
}


  
  checkJson = (message) => {
    try {
      JSON.parse(message);
    } catch {
      return false;
    }
    return true;
  };
  // getQuiz = () => {
  //   fetch('http://localhost:3000' + '/quiz/', {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     credentials: 'include',
  //     mode: 'cors',
  //   })
  //     .then(response => response.json())
  //     .then(response => this.getLastItem(response))
  //     .then(response => this.setState({ ...this.state, _id: response._id, round: response.round.number, }))
  //     .then(() => {
  //       //Dit zorgt ervoor dat scoreboard bekend is voor de websockets
  //       const msg = {
  //         role: 'scoreboard',
  //         request: '',
  //         quiz_id: this.state._id
  //       }
  //       const ws = getWebSocket();
  //       ws.send(JSON.stringify(msg));
  //     })
  // }

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
    this.setState({ ...this.state, currentPage: "answers" });
    this.getTeams();
  };

  getCurrentQuestion = () => {
    fetch("http://localhost:3000" + "/quiz/" + this.state._id + "/questions/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((response) => console.log(response));
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

  //Get answer results
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

  getResults = () => {
    fetch(
      "http://localhost:3000" +
        "/quiz/" +
        "5fe8a5a343f48c0abec93ff0" +
        "/points/",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((response) => this.filterScore(response.teams));
  };

  filterOnTeamname = (teams, search) => {
    const items = teams.filter((data) => {
      return data._id == search;
    });
    return items;
  };

  filterScore = (info) => {
    const items = info.map((data) => {
      return data;
    });
    let sortedArray = items.sort(
      (team, team2) => parseFloat(team2.score) - parseFloat(team.score)
    );
    console.log(sortedArray);
  };

  render() {
    if (this.state.currentPage == "login")
      return (
        <div className="App">
          <h1>Signin</h1>
          <Login
            savePrefsWebsocket={() => this.savePrefsWebsocket}
            data={this.state}
            setWebsocket={
              () => this.setWebsocket()
            }
          ></Login>
        </div>
      );

    if (this.state.currentPage == "waiting")
      return (
        <div className="App">
          <h1>Waiting for a quiz to start...</h1>
        </div>
      );

    if (this.state.currentPage == "waiting") {
      return (
        <div className="App">
          <h1>Waiting for a quiz to start...</h1>
        </div>
      );
    }

    if (this.state.currentPage == "teams_answering") {
      return (
        <div className="App">
          <div className="container">
            <div className="col-12">
              <h1>Quizzer</h1>
              <List content={this.state.teams_answered}></List>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.currentPage == "answers") {
      return (
        <div className="App">
          <div className="container">
            <div className="col-12">
              <h1>Quizzer</h1>
              <TableContent content={this.state.teams}></TableContent>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.currentPage == "answer_result") {
      return (
        <div className="App">
          <h1>Quizzer</h1>
          <TeamResult content={this.state.answer_results}></TeamResult>
        </div>
      );
    }

    if (this.state.currentPage == "end_game") {
      return (
        <div className="App">
          <h1>Quizzer</h1>
          <EndResult appState={this.state}></EndResult>
        </div>
      );
    }
    return (
      <div className="App">
        <h1>Quizzer</h1>
        <TableContent
          key={this.state._id}
          content={this.state.teams}
        ></TableContent>
      </div>
    );
  }
}

export default App;
