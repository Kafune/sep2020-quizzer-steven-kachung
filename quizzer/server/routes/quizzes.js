const mongoose = require('mongoose');

require('./../model/quiz');
require('./../model/team');

const express = require('express');
const quizzes = express.Router();

const Quiz = mongoose.model('Quiz');

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

    await quiz.save();

    res.send(quiz);
});

//TEAMS
quizzes.get('/:quizId/teams', async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);
    console.log(quiz);
    res.send(quiz.teams);
});

//sign in as team
quizzes.post('/:quizId/teams', async(req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);
    console.log(quiz);

    const quizTeamsInfo = {
        _id: req.body.teamName,
        score: 0,
        status: "not_accepted"
    }
    console.log(req.body.teamName);
    console.log(quiz.teams);

    console.log()

    // console.log(quiz.teams.name);
    
    //If a quiz already has a team with the same name, stop the operation
    if(quiz.teams.find(teams => {teams._id == req.body.teamName}) == undefined) {
        quiz.teams.push(quizTeamsInfo);
        await quiz.save();
        res.send(quiz);
    } else {
        res.send("Teamname is already taken, choose another one!");
    }
});

quizzes.put('/:quizId/teams', async(req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);

    //is the room full?
    if(quiz.teams.length <= 6) {
        // does team exist already?
        if(quiz.teams.find((teams => teams._id == req.body.teamName)) != undefined) {
            // quiz.teams.push(req.body.teamName);
            quiz.teams.find((teams => teams._id == req.body.teamName)).status = "accepted";
        } else {
            res.send("team does not exist!");
        }
    } else {
        res.send("maximum amount of teams in the quiz");
    }

    console.log(quiz);
    await quiz.save();
    res.send(quiz);
});

quizzes.delete('/:quizId/teams', async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);
    const currentTeam = quiz.teams.filter(team => {return team._id == req.body.teamName})
    console.log(quiz)
    console.log(currentTeam[0]._id);

    // await quiz.update(
    //     {},
    //     {$pull:{teams: {_id: currentTeam[0]._id}}}
    // ).exec();
    await quiz.teams.pull(currentTeam[0]._id);
    await quiz.save();
    res.send(quiz);

});

module.exports = quizzes;