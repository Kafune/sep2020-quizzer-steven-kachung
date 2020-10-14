const mongoose = require('mongoose');

require ('./quiz');
const Quiz = mongoose.model('Quiz');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quiz: {
        type: [Map],
        of: Quiz,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

mongoose.model('Team', teamSchema);