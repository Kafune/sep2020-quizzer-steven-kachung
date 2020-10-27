import React, { useEffect } from 'react'
import { getWebSocket } from '../serverCommunication'

export default function Waiting(props) {

    

    useEffect(() => {
        const ws = getWebSocket();
        ws.send({message: "bericht"})
        console.log(getWebSocket());
    })

    return (
        <div className="waiting_screen">
            <h1>{props.waitmessage}</h1>
        </div>
    )

}
