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
    teams: {
        type: [String],
        required: true
    }
});

mongoose.model('Quiz', quizSchema)