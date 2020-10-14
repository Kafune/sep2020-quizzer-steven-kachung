const express = require('express');
const quizzes = express.Router();

// quizzes.use('', async () => {

// });

quizzes.get('/', async(req, res) => {
    res.send("quiz terug")
});

module.exports = quizzes;

// quizzes.put('');
// quizzes.delete('');