import React from 'react';
import Button from './childcomponent/Button'
import TableContent from './childcomponent/TableContent'

class AnswerOverview extends React.Component {

    render() {
      return <React.Fragment>
        <h2>Select a question</h2>
        <TableContent teams={['rood','groen','blauw']} answer={['test', 'testje']}></TableContent>
        <Button text="Close question" color="btn-primary" clickEvent={this.fetchTeams}/>
      </React.Fragment>
    }
  }
  export default AnswerOverview;
  
