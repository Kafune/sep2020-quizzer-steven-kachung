import React from "react";
import Button from "./childcomponent/Button";
import { getWebSocket } from "../ServerCommunication";
import Panel from "./Panel";
import { withRouter } from "react-router-dom";

class Categories extends React.Component {
  state = {
    categories: [],
    selectedCategory: [],
    chosen_categories: [],
  };
  appState = this.props.appState;

  componentDidMount = () => {
    this.getCategories();
    this.getChosenCategories();
    const msg = {
      role: "quizmaster",
      quiz_id: this.appState.quiz._id,
      request: "select_category",
    };
    const ws = getWebSocket();
    ws.send(JSON.stringify(msg));
  };
  handleInput = (data) => {
    this.setState({ selectedCategory: data.name });
  };

  getCategories = () => {
    fetch("http://localhost:3000/api/v1/questions", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((result) => this.filterCategories(result))
      .then((response) =>
        this.setState({ ...this.state, categories: response })
      );
  };

  filterCategories = (data) => {
    const items = data.map((data) => {
      return data.category;
    });
    const newItems = items.filter((item, index) => {
      return items.indexOf(item) === index;
    });
    return newItems;
  };

  acceptCategory = () => {
    fetch(
      "http://localhost:3000" +
        "/quiz/" +
        this.appState.quiz._id +
        "/categories/",
      {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: this.state.selectedCategory,
        }),
      }
    )
      .then((result) => result.json())
      .then((response) => {
        this.setState({
          ...this.state,
          chosen_categories: response.round.chosen_categories,
        });
      });
  };

  getChosenCategories = () => {
    fetch(
      "http://localhost:3000" +
        "/quiz/" +
        this.appState.quiz._id +
        "/categories/",
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((result) => result.json())
      .then((response) =>
        this.setState({ ...this.state, chosen_categories: response.categories })
      );
  };

  nextStep = () => {
    if (this.state.chosen_categories.length === 0) {
      alert("Er moet een categorie gekozen worden om verder te gaan!");
    } else {
      if(this.state.chosen_categories.length >3 || this.state.chosen_categories.length <3) {
        alert("Er moeten minimaal drie categorieën worden gekozen!");
      }
      else {
      const data = {
        quiz: {
          ...this.props.appState.quiz,
          round: {
            ...this.props.appState.quiz.round,
            chosen_categories: this.state.chosen_categories,
          },
        },
      };
      this.props.newState(data);
      this.props.history.push("/quiz/questions");
    }
    }
  };

  render() {
    return this.appState.quiz._id ? (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center">Select 3 categories</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <Panel
                title={"Available categories"}
                items={this.state.categories}
                handleInput={this.handleInput}
              ></Panel>
            </div>
            <div className="col-6">
              <Panel
                title={"Selected categories"}
                items={this.state.chosen_categories}
                handleInput={this.handleInput}
              ></Panel>
            </div>
          </div>
          <div className="row">
            <Button
              text="Accept Category"
              color="btn-success"
              clickEvent={this.acceptCategory}
            ></Button>
          </div>
          <div className="row">
            <div className="col-12">
              <Button
                color="btn-primary"
                text="Start Round"
                clickEvent={this.nextStep}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>
        Er is een probleem opgetreden met de server, waardoor de quiz niet
        aangemaakt kon worden!
      </div>
    );
  }
}
export default withRouter(Categories);
