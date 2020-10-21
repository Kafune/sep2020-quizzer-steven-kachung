'use strict';

const mongoose = require('mongoose');
const session = require('express-session');
const express = require('express');
const cors = require('cors');               // needed for using webpack-devserver with express server
const bodyParser = require('body-parser')
const http = require('http');
const ws = require('ws');

const expressApp = express();
const expressPort = 3000;
const httpServer = http.createServer();
const webSocketServer = new ws.Server({
    server: httpServer
});

// needed to make all requests from client work with this server.
expressApp.use(cors({ origin: true, credentials: true }));
expressApp.options("*", cors({ origin: true, credentials: true }));

const dbName = 'quizzer';

expressApp.use(bodyParser.json());


//routes
const quizzes = require('./routes/quizzes');
const api = require('./routes/api');

expressApp.use('/quiz', quizzes);
expressApp.use('/api/v1', api);

expressApp.get('/', async (req, res) => {
    res.send('bericht terug');
})


webSocketServer.on('connection', (socket) => {
    console.log("verbinding geslaagd");
    //generate an id so server knows who connected.
    //also need to check based on role between scoreboard, client or quizmaster

    socket.on('message', (msg) => {
        let msgObject = JSON.parse(msg);
        console.log(msgObject);
        socket.role = msgObject.role;
        socket.name = msgObject.name;
        console.log(msgObject);
        if(socket.get_teams) {
            //Maak een post request
        }
    });
});

httpServer.on("request", expressApp);
httpServer.listen(expressPort, () => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log('Server started on port 3000');
    });
});

