import React from 'react'
import Button from './childcomponent/Button';
import { openWebSocket, getWebSocket, startQuiz, getTeams } from '../ServerCommunication';
import Panel from './Panel';

export default class Categories extends React.Component {
    state = {
      categories: [{
        '_id': 'Film and TV',
      }],
      
    }

  handleInput = (data) => {
    console.log(data);
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
                <Panel
                  title={'Selected categories'}
                  items={this.state.categories}
                  handleInput={this.handleInput}
                  >
                </Panel>
                  </div>
              </div>
              <div className="row">
                <Button></Button>
              </div>
         
              </div>
            </div>
      )
   }
}
