import React from 'react'

export default class Waiting extends React.Component{

    render() {
        return (
            <div className="waiting_screen">
                <h1>{this.props.waitmessage}</h1>
            </div>
        )
       }
    }
