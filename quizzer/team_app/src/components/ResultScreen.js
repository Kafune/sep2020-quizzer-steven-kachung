import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom'
import InputField from './childcomponents/InputField';
import Button from './childcomponents/Button';
import { getWebSocket, changeTeamName, getCurrentQuestion } from '../serverCommunication'




function ResultScreen(props) {
    const appState = props.data;

    
}

export default withRouter(ResultScreen)
