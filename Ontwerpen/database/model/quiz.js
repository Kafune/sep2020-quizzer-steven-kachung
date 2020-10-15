const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
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

// quizSchema.methods.createNewQuiz = async function() {

// }

mongoose.model('Quiz', quizSchema)