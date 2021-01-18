
import React from 'react';

class List extends React.Component {
    
    render() {

        const content = this.props.content.map((data) => {
            return <div className="col-4">
                <p>Name: {data.name}</p>
                <p>Answer: {data.answer}</p>
                {data.result ? 
                  <p>Result: Correct!</p>
                  : <p>Result: Incorrect!</p>  
              }
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
  