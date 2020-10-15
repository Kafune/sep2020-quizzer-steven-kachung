const mongoose = require('mongoose');

require('../model/quiz');

const express = require('express');
const quizzes = express.Router();

const Quiz = mongoose.model('Quiz');

// quizzes.use('', async () => {

// });

quizzes.get('/', async (req, res) => {
        // Haal alle quizzes op
    res.send(quizzes.find());
});

quizzes.get('/:quizId', async (req, res) => {
    // Haal alle quizzes op
    const quiz= await Quiz.findById(req.params.quizId)
    console.log(quiz);
    res.send(quiz);
});

quizzes.post('/', async (req, res) => {
    const quizRoomInfo = {
        password: null,
        round: 1,
        teams: []
    };

    const databasePassword = (password) => {
        return Quiz.findOne({password: password})
    }
    //generate random quiz room password
    quizRoomInfo.password = Math.random().toString(36).substr(2, 7);
    

    // check if generated password exists in database
    // generate a new password if that's the case
    if(databasePassword(quizRoomInfo.password) == quizRoomInfo.password) {
        quizRoomInfo.password = Math.random().toString(36).substr(2, 7);
    }


    const quiz = new Quiz(quizRoomInfo);
    // quiz.isNew = false;
    // quiz master maakt hier nieuwe quiz aan.
    // console.log(quiz.createNewQuiz());

    // await quiz.createNewQuiz();
    await quiz.save();

    res.send(quiz);
});

quizzes.get('/:quizId/teams', async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);
    console.log(quiz);
    res.send(quiz.teams);
});

quizzes.put('/:quizId/teams', async(req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);

    if(quiz.teams.length <= 6) {
        if(!quiz.teams.includes(req.body.teamName)) {
            quiz.teams.push(req.body.teamName);
        } else {
            res.send("team is already in a quiz!");
        }
    } else {
        res.send("maximum amount of teams in the quiz");
    }

    console.log(quiz);
    await quiz.save();
    res.send(quiz);
});

quizzes.delete('/', async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);

    quiz.teams.filter(team => {return team !== req.body.teamName})

});

module.exports = quizzes;

// quizzes.put('');
// quizzes.delete('');