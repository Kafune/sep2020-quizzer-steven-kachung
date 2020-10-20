const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

require('./../model/question');

const express = require('express');
const api = express.Router();

const Question = mongoose.model('Question');

api.get('/', async(req, res) => {
    res.send("testroute");
});

api.get('/questions', async(req, res) => {

});

api.post('/questions', async(req, res) => {
    const questionInfo = [];
    
    
    // {
    //     question: req.body.question,
    //     answer: req.body.answer,
    //     category: req.body.category
    // };

    // for() {

    // }

    await Question.insertMany(questionInfo);


    // const question = new Question(questionInfo);

    // await question.save();

    res.send(question);
    
});

//
api.put('/questions', async(req, res) => {

});

api.delete('/questions', async(req, res) => {

});

module.exports = api;