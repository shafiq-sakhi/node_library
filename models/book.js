const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');

const Book = mongoose.model('Book',new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    category: categorySchema,
    numberInStock: {type: Number, required: true},
    dailySellRate: Number
}));

function validateBook(book){
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        categoryId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailySellRate: Joi.number()
    });
    return schema.validate(book);
}

exports.Book = Book;
exports.validateBook = validateBook;