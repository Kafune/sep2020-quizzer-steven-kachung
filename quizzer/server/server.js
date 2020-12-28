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

const httpServer = http.createServer(expressApp);
const webSocketServer = new ws.Server({
    noServer: true
});

httpServer.on('upgrade', (req, networkSocket, head) => {
    sessionParser(req, {}, () => {
        if (req.session.role === undefined) {
            networkSocket.destroy();
            return;
        }

        console.log('Session is parsed!');

        webSocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
            webSocketServer.emit('connection', newWebSocket, req);
        });
    });
});

webSocketServer.on('connection', (socket, req) => {
    console.log("connected");

    //generate an id so server knows who connected.
    //also need to check based on role between scoreboard, client or quizmaster
    socket.on('message', (msg) => {
        req.session.reload(err => {
            if (err) throw err

            if (req.session.quiz_id == undefined) {
                console.log("Quiz is not loaded correctly")
                return;
            }

            let msgObject = JSON.parse(msg);

            if (socket.role == undefined) {
                socket.role = req.session.role;
            }

            if (socket.quiz_id == undefined) {
                socket.quiz_id = req.session.quiz_id;
            }
            socket.request = msgObject.request;

            if (socket.role == "client") {
                socket.teamname = req.session.teamname;
            }
            if (socket.role == "quizmaster") {
                if (msgObject.teamname !== undefined) {
                    socket.teamname = msgObject.teamname;
                }
            }

            if (socket.role == "scoreboard") {
                socket.teamname = msgObject.teamname;
            }

            switch (socket.request) {
                case 'get_teams':
                    if (socket.role == 'quizmaster') {
                        //Maak een post request
                        webSocketServer.clients.forEach((client) => {
                            client.send(socket.request);
                        });
                    } else {
                    }
                    break;
                case 'register_team':
                    if (socket.role == 'client') {
                        //stuur bericht naar quizmaster toe
                        webSocketServer.clients.forEach((client) => {
                            if (client.role == 'quizmaster') {
                                client.send('get_teams');
                            }

                        })
                    }
                    break;
                case 'deny_team':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (client.teamname == socket.teamname) {
                                client.send('deny_team');
                            }

                        })
                    }
                    break;
                case 'accept_team':
                    if (socket.role == 'client') {
                        webSocketServer.clients.forEach((client) => {
                            client.send('accept_team');
                        })
                    }
                    break;
                case 'change_teamname':
                    if (socket.role == 'client') {
                        webSocketServer.clients.forEach((client) => {
                            client.send('get_teams');
                        })
                    }
                    break;
                case 'start_round':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (client.role == 'client') {
                                client.send('start_round');

                            }
                        })
                    }
                    break;
                case 'select_category':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            client.send('select_category')
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
                        socket.answer = msgObject.answer;

                        webSocketServer.clients.forEach((client) => {
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
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'client') {
                                    client.send('closed_question')
                                }
                            }
                        })
                    }
                    break;
                case 'approve_question':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach(client => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    const msg = {
                                        subject: "new_answer_result",
                                        teamname: socket.teamname,
                                        correct_answer: true
                                    }
                                    client.send(JSON.stringify(msg))

                                }

                                if (client.role === 'client') {
                                    console.log(client.teamname)
                                    if (socket.teamname == client.teamname) {
                                        console.log("wel gelukt")
                                        client.send('question_approved')
                                    } else {
                                        console.log("niet gelukt")
                                    }
                                }
                            }
                        })

                    }
                    break;
                case 'deny_question':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    const msg = {
                                        subject: "new_answer_result",
                                        teamname: socket.teamname,
                                        correct_answer: false
                                    }
                                    client.send(JSON.stringify(msg))
                                }
                                if (client.role == 'client') {
                                    if (client.teamname == socket.teamname) {
                                        client.send('question_denied')
                                    }
                                }
                            }
                        })
                    }
                    break;
                case 'new_quiz':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            client.send('new_quiz')
                        })
                    }
                    break;

                // Scoreboard websockets
                case 'new_answer':
                    if (socket.role == 'client') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    client.send('new_answer')
                                }
                            }
                        })
                    }
                    break;

                    break;
                case 'quiz_started':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    client.send('quiz_started')
                                }
                            }
                        })
                    }
                    break;

                case 'answer_result':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    client.send('answer_result')
                                }
                            }
                        })
                    }
                    break;
                case 'next_question':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    client.send('next_question')
                                }
                            }
                        })
                    }
                    break;
                case 'end_game':
                    if (socket.role == 'quizmaster') {
                        webSocketServer.clients.forEach((client) => {
                            if (socket.quiz_id == client.quiz_id) {
                                if (client.role == 'scoreboard') {
                                    client.send('end_game')
                                }
                            }
                        })
                    }
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

httpServer.listen(expressPort, () => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('Server started on port 3000');
    });
});

