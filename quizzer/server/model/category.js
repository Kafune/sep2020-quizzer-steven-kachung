const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true,
    }
})

mongoose.model('Category', categorySchema);