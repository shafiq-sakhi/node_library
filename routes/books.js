const validateObjectId = require('../middleware/validate_id');
const express = require('express');
const {Book, validateBook} = require('../models/book');
const {Category} = require('../models/category');
const router = express.Router();

  
router.get('/', async (req,res)=> {
    const books = await Book.find();
    res.send(books);
});

router.post('/', async (req,res)=> {
    const {error} = validateBook(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if(!category) return res.status(400).send('Invalid category..');

    const book = Book({
        title: req.body.title,
        category: {
            _id : category._id,
            name: category.name
        },
        numberInStock: req.body.numberInStock,
        dailySellRate: req.body.dailySellRate
    });
    
    await book.save();
    res.send(book);
});

router.put('/:id',async (req,res)=> {
    const {error} = validateBook(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const book = await Book.findByIdAndUpdate(req.params.id,{
        title: req.body.title,
        category: req.body.category,
        numberInStock: req.body.numberInStock,
        dailySellRate: req.body.dailySellRate
    },{new: true});

    if(!book) return res.status(404).send('The book with the given ID is not found..');

    res.send(book);
});

router.get('/:id',validateObjectId, async (req,res)=> {
    const book = await Book.findById(req.params.id);

    if(!book) return res.status(404).send('The book with the given ID is not found..');

    res.send(book);
});

router.delete('/:id', async (req,res)=> {
    const book = await Book.findByIdAndRemove(req.params.id);

    if(!book) return res.status(404).send('The book with the given ID is not found..');

    res.send(book);
});

module.exports = router;