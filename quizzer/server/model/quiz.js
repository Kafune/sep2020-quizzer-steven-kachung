const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        unique: true
    },
    round: {
        type: Number,
        required: true
    },
    teams: [{
        _id: {
            type: String
            // unique: true
        },
        score: Number,
        status: String
    }]
});

mongoose.model('Quiz', quizSchema)