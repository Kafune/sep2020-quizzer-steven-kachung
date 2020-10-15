import React from 'react';

const NewTeamsPanel = (props) => {
    // const teams = props.teams.map();
    console.log(props.teams)
    
    return (
    <div>
        <div className="panel">New Teams:
        {props.teams}
        </div>
        <button >
            Accept Team
        </button>
        <button >
            Deny Team
        </button>
    </div>
    )
  }
  

export default NewTeamsPanel;