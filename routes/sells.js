const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const {Sell, validateSell} = require('../models/sell');
const {Customer} = require('../models/customer');
const {Book} = require('../models/book');
// const Fawn = require('fawn');
const router = express.Router();

// Fawn.init(mongoose);

router.get('/', async (req,res)=> {
    const books = await Sell.find().sort('-date');
    res.send(books);
});

router.post('/',auth, async (req,res)=> {
    const {error} = validateSell(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer..');

    const book = await Book.findById(req.body.bookId);
    if(!book) return res.status(400).send('Invalid book..');

    if(book.numberInStock === 0) return res.status(400).send('This book is not exist in stock!');
    if(book.numberInStock < req.body.amount) return res.status(400).send('Insuffecient stock!');

    const sell = Sell({
        price: req.body.price,
        customer: {
            _id : customer._id,
            name: customer.name,
            phone: customer.phone
        },
        amount: req.body.amount,
        book: {
            _id : book._id,
            title: book.title,
            dailySellRate: book.dailySellRate
        },
    });
    
    //the below implementation is risky of inconsistency
    await sell.save();

    book.numberInStock = book.numberInStock - req.body.amount;
    book.save();
    res.send(sell);

    // try{
    //     //in this case we use fawn to prevent it and act as transaction in relational db
    //     new Fawn.Task().
    //         save('sells',sell).
    //         update('books',{_id: book._id},{
    //             $inc: {numberInStock: -res.body.amount}
    //         }).run();

    //     res.send(result);
    // }catch(ex){
    //     res.status(500).send('Internal server error.');
    // }
});

router.put('/:id',async (req,res)=> {
    const {error} = validateSell(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer..');

    const book = await Book.findById(req.body.bookId);
    if(!book) return res.status(400).send('Invalid book..');

    const sell = await Sell.findByIdAndUpdate(req.params.id,{
        price: req.body.price,
        customer: {
            _id : customer._id,
            name: customer.name,
            phone: customer.phone
        },
        amount: req.body.amount,
        book: {
            _id : book._id,
            title: book.title,
            dailySellRate: book.dailySellRate
        },
    },{new: true});

    if(!sell) return res.status(404).send('The sell with the given ID is not found..');

    res.send(sell);
});

router.get('/:id', async (req,res)=> {
    const sell = await Sell.findById(req.params.id);

    if(!sell) return res.status(404).send('The sell with the given ID is not found..');

    res.send(sell);
});

router.delete('/:id', [auth,isAdmin],async (req,res)=> {
    const sell = await Sell.findByIdAndRemove(req.params.id);

    if(!sell) return res.status(404).send('The sell with the given ID is not found..');

    res.send(sell);
});

module.exports = router;