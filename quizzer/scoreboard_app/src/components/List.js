import React from 'react';

class List extends React.Component {
    
    render() {

      const content = this.props.content.map((data) => {
        return <tr key={data._id}>
          <td>{data._id}</td>
        </tr>
        
      });
      return <React.Fragment>
 
        <table className="table table-bordered">
            <thead className="thead-dark">
            <tr>
                <th scope="col">Teams that already answered</th>
            </tr>
            </thead>
            <tbody>
            {content}
            </tbody>
            </table>
      </React.Fragment>
    }
  }
  export default List;
  