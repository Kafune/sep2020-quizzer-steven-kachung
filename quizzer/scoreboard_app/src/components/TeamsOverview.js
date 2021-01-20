
import React from 'react';
import { getWebSocket } from "../ServerCommunication";

class TeamsOverview extends React.Component {
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
        case "select_question":
          this.props.newState({
            ...this.props.appState,
            currentPage: "teams_answering",
          });
          break;
        }

    };
  }
    render() {

      const content = this.props.content.map((data) => {
        return <tr key={data._id}>
          <td>{data._id}</td>
          <td>{data.questions_answered}</td>
        </tr>
        
      });
      return <React.Fragment>
        <table className="table table-bordered">
            <thead className="thead-dark">
            <tr>
                <th scope="col">Teamname</th>
                <th scope="col">Correctly answered questions</th>
            </tr>
            </thead>
            <tbody>
            {content}
            </tbody>
            </table>
      </React.Fragment>
    }
  }
  export default TeamsOverview;
  