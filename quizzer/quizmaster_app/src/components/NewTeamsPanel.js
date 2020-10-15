import React from 'react';

const NewTeamsPanel = (props) => {
    return (
    <div>
        <button >
            Accept Team
        </button>
        <button >
            Deny Team
        </button>
        <div className="panel">New Teams:
        {props.teams}
        </div>

    </div>
    )
  }
  

export default NewTeamsPanel;