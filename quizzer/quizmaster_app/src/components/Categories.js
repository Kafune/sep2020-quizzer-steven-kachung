import React from 'react'
import Button from './childcomponent/Button';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from '../ServerCommunication';
import Panel from './Panel';

export default class Categories extends React.Component {
    state = {
      categories: []
      
    }
  handleInput = (data) => {
    console.log(data);
  }

  getCategories = () => {
    fetch('http://localhost:3000/api/v1/questions', {
        method: 'GET',
        mode: 'cors', 
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(result => result.json())
      .then(result => this.filterCategories(result))
      .then(response => this.setState({ ...this.state, categories: response  }))
      .then(() => console.log(this.state))
  }

  filterCategories = (data) => {
    const items = data.map(data => {     
      return data.category;
    });
    const newItems = items.filter((item, index) => {
      return items.indexOf(item) === index
    });
    return newItems
    }

   render() {
      return (     
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
                title={'Available categories'}
                items={this.state.categories}
                handleInput={this.handleInput}
                ></Panel>
                </div>
                <div className="col-6">
                {/* <Panel
                  title={'Selected categories'}
                  items={this.state.categories}
                  handleInput={this.handleInput}
                  >
                </Panel> */}
                  </div>
              </div>
              <div className="row">
                <Button text="Ophalen categorie" clickEvent={this.getCategories}></Button>
                <Button text="Accept Category" clickEvent={this.getCategories}></Button>
                <Button text="Deny Category" clickEvent={this.getCategories}></Button>
              </div>
         
              </div>
            </div>
      )
   }
}
