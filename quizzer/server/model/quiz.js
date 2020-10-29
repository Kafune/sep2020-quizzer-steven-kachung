const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        unique: true
    },
    round: {
        number: {type: Number, required: true},
        chosen_categories: [String],
        chosen_questions: [String]
  
    },
    teams: [{
        _id: String,
        score: Number,
        status: String
    }]
});

mongoose.model('Quiz', quizSchema)