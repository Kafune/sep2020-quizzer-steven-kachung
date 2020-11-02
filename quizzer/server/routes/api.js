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
    res.send(await Question.find());
});

api.get('/questions/categories', async (req,res) => {
    const categories = req.body.categories;

    await Question.find({"category": {$in: categories}}, (err, result) => {
        if(err) {
            res.send(err);
        }
        else {
            res.send(result)
        }
    })
});

api.post('/questions', async(req, res) => {
    const questionInfo = {
        question: req.body.question,
        answer: req.body.answer,
        category: req.body.category
    };

    const question = await Question.create(questionInfo);

    res.send(question);
});

//edit a question
api.put('/questions', async(req, res) => {
    
});

//delete a question
api.delete('/questions', async(req, res) => {

});

module.exports = api;