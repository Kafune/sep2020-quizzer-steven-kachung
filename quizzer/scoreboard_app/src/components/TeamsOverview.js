
import React from 'react';

class TeamsOverview extends React.Component {
    
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
  