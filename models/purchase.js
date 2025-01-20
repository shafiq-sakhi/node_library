const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category')

const purchaseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    category: categorySchema,
});

const Purchase = mongoose.model('Purchase',purchaseSchema);

function validatePurchase(staff){
    const schema = Joi.object({
        name: Joi.number().required()
    });
    return schema.validate(staff);
}

exports.Purchase = Purchase;
exports.purchaseSchema = purchaseSchema;
exports.validatePurchase = validatePurchase;