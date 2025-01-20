const express = require('express');
const books = require('../routes/books');
const customers = require('../routes/customers');
const error = require('../middleware/error');
const sells = require('../routes/sells');
const home = require('../routes/home');
const auth = require('../routes/auth');
const users = require('../routes/users');
const purchases = require('../routes/purchases');
const categories = require('../routes/categories');

module.exports = function(app){
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use('/api/books',books);
    app.use('/api/sells',sells);
    app.use('/api/customers',customers);
    app.use('/api/categories',categories);
    app.use('/api/users',users);
    app.use('/api/purchases',purchases);
    app.use('/',home);
    app.use('/api/auth',auth);
    app.use(error);
}