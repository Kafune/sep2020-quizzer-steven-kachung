import React from 'react';

class EndResult extends React.Component {
    
    render() {
        console.log(this.props.appState)

      return <React.Fragment>
      
          <div className="container">
         <div id="podium-box" className="row" style={{height: 300 + 'px'}}>
            <div class="col-md-4 step-container m-0 p-0">
                <div>
                </div>
                <div id="second-step" className="bg-silver step centerBoth podium-number">
                2
                </div>
            </div>
            <div class="col-md-4 step-container m-0 p-0">
                <div>
                </div>
                <div id="first-step" className="bg-gold step centerBoth podium-number">
                1
                </div>
            </div>
            <div class="col-md-4 step-container m-0 p-0">
                <div id="third-step" className="bg-bronze step centerBoth podium-number">
                3
                </div>
            </div>
            </div>
            </div>
      </React.Fragment>
    }
  }
  export default EndResult;
  