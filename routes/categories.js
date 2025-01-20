require('express-async-errors');
const express = require('express');
const {Category, validateCategory} = require('../models/category');
const router = express.Router();

router.get('/', async (req,res)=> {
    const categories = await Category.find();
    res.send(categories);
});

router.post('/', async (req,res)=> {
    const {error} = validateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const category = Category({
        name: req.body.name
    });
    
    const result = await category.save();
    res.send(result);
});

router.put('/:id', async (req,res)=> {
    const {error} = validateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        author: req.body.author,
        tags: req.body.tags,
        isPublished: req.body.isPublished
    },{new: true});

    if(!category) return res.status(404).send('The category with the given ID is not found..');

    res.send(category);
});

router.get('/:id', async (req,res)=> {
    const category = await Category.findById(req.params.id);

    if(!category) return res.status(404).send('The category with the given ID is not found..');

    res.send(category);
});

router.delete('/:id', async (req,res)=> {
    const category = await Category.findByIdAndRemove(req.params.id);

    if(!category) return res.status(404).send('The category with the given ID is not found..');

    res.send(category);
});

module.exports = router;