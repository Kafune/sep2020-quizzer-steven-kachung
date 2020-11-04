
import React from 'react';

class List extends React.Component {
    
    render() {

        const content = this.props.content.map((data) => {
            return <div className="col-4">
                <p>{data.name}</p>
                <p>{data.answer}</p>
                <p>true</p>
            </div>
            
          });
      return <React.Fragment>
 
        <div className="container">
            <div className="row">
            {content}
            </div>
        </div>
      </React.Fragment>
    }
  }
  export default List;
  