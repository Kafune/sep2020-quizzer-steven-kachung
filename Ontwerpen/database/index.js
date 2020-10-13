const mongoose = require('mongoose');

const dbName = 'quizzer';

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true});

