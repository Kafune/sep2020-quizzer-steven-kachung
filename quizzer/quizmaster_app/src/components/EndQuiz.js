import React from 'react';
import Button from './childcomponent/Button';

const EndQuiz = (props) => {
    return (
        <React.Fragment>
            <Button text="Play another round" color="btn-success pull-right"/>
            <Button text="End quiz night" color="btn-danger pull-right"/>
        </React.Fragment>
    )
  }
  

export default EndQuiz;