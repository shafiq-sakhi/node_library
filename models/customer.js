const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer',new mongoose.Schema({
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
        maxlength: 250
    },
    address: {
        type: String,
        minlength: 3,
        maxlength: 250
    },
}));

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().required(),
        address: Joi.string()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;