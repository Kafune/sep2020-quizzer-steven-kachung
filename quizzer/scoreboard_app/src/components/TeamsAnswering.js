import React from "react";
import { getWebSocket } from "../ServerCommunication";

class TeamsAnswering extends React.Component {
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
        case "new_answer":
          this.props.getTeamsWhoAnswered();
          break;
        case "closed_question":
          this.props.newState({
            ...this.props.appState,
            currentPage: "answer_result",
          });
          break;
      }
    };
  }

  render() {
    const content = this.props.content.map((data) => {
      return (
        <tr key={data._id}>
          <td>{data._id}</td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Teams that already answered</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </React.Fragment>
    );
  }
}
export default TeamsAnswering;
