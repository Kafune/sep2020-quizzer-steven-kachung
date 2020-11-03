'use strict';

const mongoose = require('mongoose');
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const http = require('http');
const ws = require('ws');

const expressApp = express();
const expressPort = 3000;
const httpServer = http.createServer();
const webSocketServer = new ws.Server({
    verifyClient: checkConnection,
    server: httpServer,
    path: "/"
});

// needed to make all requests from client work with this server.
expressApp.use(cors({ origin: true, credentials: true }));
expressApp.options("*", cors({ origin: true, credentials: true }));

const dbName = 'quizzer';

expressApp.use(bodyParser.json());

//session parser
const sessionParser = session({
    saveUninitialized: false,
    secret: 'aT0k3n',
    resave: false
});

expressApp.use(sessionParser);

//routes
const quizzes = require('./routes/quizzes');
const api = require('./routes/api');

expressApp.use('/quiz', quizzes);
expressApp.use('/api/v1', api);

expressApp.get('/', async (req, res) => {
    res.send('bericht terug');
})

function checkConnection(info, done) {
    console.log('Parsing session from request...');

    sessionParser(info.req, {}, () => {

        console.log('Session is parsed!');

        done(info.req);
    });
}

webSocketServer.on('connection', (socket, req) => {
    console.log("connected");

    //generate an id so server knows who connected.
    //also need to check based on role between scoreboard, client or quizmaster
    socket.on('message', (msg) => {
        req.session.reload(() => {
            // if (err) throw err
            let msgObject = JSON.parse(msg);
            console.log(msgObject)

            socket.role = msgObject.role;
            socket.request = msgObject.request;
            socket.quiz_id = msgObject.quiz_id;

            if (socket.role == "client") {
                socket.teamname = req.session.teamname;
            }
            if (socket.role == "quizmaster") {

                if (msgObject.teamname !== undefined) {
                    socket.teamname = msgObject.teamname;
                }
                // if(msgObject.approvedTeams !== undefined) {
                //     socket.approvedTeams = msgObject.approvedTeams;
                // }
            }
            // console.log(socket.approvedTeams)

            switch (socket.request) {
                case 'get_teams':
                    if (socket.role == 'quizmaster') {
                        //Maak een post request
                        console.log('haal teams op');
                        // console.log(webSocketServer.clients);
                        // console.log(socket.request);
                        webSocketServer.clients.forEach((client) => {
                            client.send(socket.request);
                        });
                        // console.log(client1);
                    } else {
                        console.log("niet bevoegd!");
                    }
                    break;
                case 'register_team':
                    if (socket.role == 'client') {
                        console.log("registreer hier");
                        //stuur bericht naar quizmaster toe
                        webSocketServer.clients.forEach((client) => {
                            client.send('get_teams');
                        })
                    }
                    break;
                case 'deny_team':
                    if (socket.role == 'quizmaster') {
                        console.log("Deny team");
                        webSocketServer.clients.forEach((client) => {
                            if (client.teamname == socket.teamname) {
                                client.send('deny_team');
                            }

                        })
                    }
                    break;
                case 'accept_team':
                    if (socket.role == 'client') {
                        console.log("Accept team");
                        webSocketServer.clients.forEach((client) => {
                            client.send('accept_team');
                        })
                    }
                    break;
                case 'change_teamname':
                    if (socket.role == 'client') {
                        console.log('namechange')
                        webSocketServer.clients.forEach((client) => {
                            // console.log(client)
                            client.send('get_teams');
                        })
                    }
                    break;
                case 'start_round':
                    if (socket.role == 'quizmaster') {
                        console.log("start round")
                        webSocketServer.clients.forEach((client) => {
                            if (client.role == 'client') {
                                if (client.quiz_id == socket.quiz_id) {
                                    client.send('start_round');
                                }
                            }
                        })
                    }
                    break;
                case 'select_question':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                client.send('select_question')
                            }
                        })
                    }
                    break;
                case 'question_answered':
                    if (socket.role == 'client') {
                        console.log('beantwoorde vraag')
                        socket.answer = msgObject.answer;

                        webSocketServer.clients.forEach((client) => {
                            console.log(client.teamname)
                            console.log(client.role)
                            //TODO: sessions not working atm somehow
                            socket.teamname = msgObject.teamname;
                            const msg = {
                                teamname: socket.teamname,
                                answer: socket.answer
                            }
                            //check if same quiz
                            if (socket.quiz_id == client.quiz_id) {
                                console.log(client.teamname)
                                //only send msg to quizmaster
                                if (client.role == 'quizmaster') {
                                    console.log(JSON.stringify(msg))
                                    client.send(JSON.stringify(msg))
                                }
                            }
                        })
                    }
                    break;
                case 'question_closed':
                    if(socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {

                            }
                        })
                    }
                    break;
                case 'approve_question':
                    
                    break;
                case 'deny_question':
                    
                    break;
                default:
                    console.log("no request");
            }
            req.session.save();
        });

    })
    socket.on('close', () => {
        console.log('connection closed');
    })
});

httpServer.on("request", expressApp);
httpServer.listen(expressPort, () => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('Server started on port 3000');
    });
});

