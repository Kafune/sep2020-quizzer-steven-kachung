import React from 'react';

const ApprovedTeamsPanel = (props) => {
    
    return (
    <div>
        <div className="panel">Approved Teams:
        {props.teams}
        </div>
    </div>
    )
  }
  

export default ApprovedTeamsPanel;