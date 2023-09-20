const mongoose = require('mongoose');

const { Schema } = mongoose;

const BooksSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    price: {
        type: Number,
    }
})

module.exports = mongoose.model('Books', BooksSchema);