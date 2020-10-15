const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    password: {
        type: String,
        required: true
        // unique: true
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

quizSchema.methods.createNewQuiz = async function() {
    // await this.create({

    // }, function(err, quiz) {
    //     if(err) return handleError(err);
    //     console.log(quiz);
    // });
    // return this;
}

mongoose.model('Quiz', quizSchema)