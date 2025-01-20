const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Sell = mongoose.model('Sell',new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 100000000
    },
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            phone: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
        }),
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    book: new mongoose.Schema({
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        },
        dailySellRate: {
            type: Number,
            required: true,
            minlength: 0
        },
    }),
    date: {
        type: Date,
        requied: true,
        default: Date.now
    }
}));

function validateSell(customer){
    const schema = Joi.object({
        price: Joi.number().required(),
        customerId: Joi.objectId().required(),
        amount: Joi.number().required(),
        bookId: Joi.objectId().required()
    });
    return schema.validate(customer);
}

exports.Sell = Sell;
exports.validateSell = validateSell;