const mongoose = require('mongoose');

require('../model/quiz');

const express = require('express');
const quizzes = express.Router();

const Quiz = mongoose.model('Quiz');

// quizzes.use('', async () => {

// });

quizzes.get('/', async (req, res) => {
        // Haal alle quizzes op
    res.send(quizzes.find({}));
});

quizzes.post('/', async (req, res) => {
    const quiz = new Quiz({
        password: 12345,
        round: 1,
        teams: []
    });
    // quiz.isNew = false;
    // quiz master maakt hier nieuwe quiz aan.
    // console.log(quiz.createNewQuiz());

    // await quiz.createNewQuiz();
    await quiz.save();

    res.send(quiz);
});

quizzes.delete('/', async (req, res) => {

})

module.exports = quizzes;

// quizzes.put('');
// quizzes.delete('');