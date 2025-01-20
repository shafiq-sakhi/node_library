require('express-async-errors');
const express = require('express');
const {Purchase, validatePurchase} = require('../models/purchase');
const router = express.Router();

router.post('/', async (req,res)=> {
    if(!req.body.categoryId) return res.status(400).send('customer id is required');
    
    return res.status(401).send('Not logged in');
});

module.exports = router;