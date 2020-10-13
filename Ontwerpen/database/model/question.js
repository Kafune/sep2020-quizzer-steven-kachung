const mongoose = require('mongoose');
require('./category')
const Category = mongoose.model('Category');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: [Map],
        of: Category,
        required: true
    }
});

mongoose.model('Question', questionSchema);