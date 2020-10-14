'use strict';

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

//routes
const quizzes = require('./routes/quizzes');

expressApp.use('/quizzes', quizzes);

expressApp.get('/', async (req, res) => {
    res.send('bericht terug')
})

webSocketServer.on('connection', function connection(websocket) {
    console.log("verbinding geslaagd");

    webSocketServer.on('message', function incomingMessage(message) {
        
    })
});

httpServer.on("request", expressApp);
httpServer.listen(expressPort, () => {
    console.log("Server is listening on port 3000");
});

