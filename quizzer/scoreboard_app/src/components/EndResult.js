import React from 'react';
import { getWebSocket,getQuiz } from "../ServerCommunication";

class EndResult extends React.Component {

    componentDidMount() {
        let ws = getWebSocket();
        ws.onerror = () => {
          console.log("error");
        };
        ws.onopen = () => {
          console.log("connected");
        };
        ws.onclose = () => {};
        ws.onmessage = (msg) => {
            switch (msg.data) {
                case "start_round":
                  this.props.requestTeams()
                  getQuiz(this.props.appState.password).then((response) => {
                    this.props.newState({
                      ...this.props.appState,
                      quizInfoVisible: false,
                      round: response.round.number,
                      answer_results: [],
                      teams_answered: [],
                      question: {
                        ...this.props.appState.question,
                        number: 1,
                      },
                      currentPage: "teams_overview",
                    });
                    return response;
                  });
                  break;
            }
        };
      }

    render() {
        console.log(this.props.appState)

      return <React.Fragment>
      
          <div className="container">
         <div id="podium-box" className="row" style={{height: 300 + 'px'}}>
            <div class="col-md-4 step-container m-0 p-0">
                <div>
                </div>
                <div id="second-step" className="bg-silver step centerBoth podium-number">
                2
                </div>
            </div>
            <div class="col-md-4 step-container m-0 p-0">
                <div>
                </div>
                <div id="first-step" className="bg-gold step centerBoth podium-number">
                1
                </div>
            </div>
            <div class="col-md-4 step-container m-0 p-0">
                <div id="third-step" className="bg-bronze step centerBoth podium-number">
                3
                </div>
            </div>
            </div>
            </div>
      </React.Fragment>
    }
  }
  export default EndResult;
  