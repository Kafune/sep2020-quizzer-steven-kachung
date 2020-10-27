import React from 'react';
import { useHistory } from "react-router-dom";


function Question (props) {
  const history = useHistory();
   const handleButton = () =>{ 
    //TODO: POST request to add a new question 

    let path = `answers`; 
    history.push(path);
  }
  
      return <React.Fragment>
          <div className="card" onClick={handleButton}>
            <div className="card-header"> 
                <p className="card-text">{props.question}</p>
                <h3 className="card-title">{props.category}</h3>
            </div>
            </div>
            <br></br>
      </React.Fragment>
    
  }
  export default Question;
  