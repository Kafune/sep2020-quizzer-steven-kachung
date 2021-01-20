const mongoose = require('mongoose');

require('./question')
const Question = mongoose.model('Question');

const quizSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        unique: true
    },
    round: {
        number: {type: Number, required: true},
        chosen_categories: [String],
        chosen_questions: {
            type: [Map],
            of: Question,
            required: true
        }
    },
    teams: [{
        _id: String,
        score: Number,
        status: String,
        answer: String,
        questions_answered: Number
    }]
});

mongoose.model('Quiz', quizSchema)