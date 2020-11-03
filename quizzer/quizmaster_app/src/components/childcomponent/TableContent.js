
import React from 'react';

class TableContent extends React.Component {

    render() {
      return <React.Fragment>
        <table className="table table-bordered">
            <thead className="thead-dark">
            <tr>
                <th scope="col">#</th>
                <th scope="col">Team</th>
                <th scope="col">Answer</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
            </tr>
            </tbody>
            </table>
      </React.Fragment>
    }
  }
  export default TableContent;
  
