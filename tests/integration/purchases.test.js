const request = require('supertest');
const {Purchase} = require('../../models/purchase');
const mongoose = require('mongoose');
const { Category } = require('../../models/category');

describe('/api/purchase',()=>{
    let server;
    let purchase;
    let categoryId;

    beforeEach(async ()=> {
        
        server = require('../../index');
        categoryId = new mongoose.Types.ObjectId();
        purchase = new Purchase({
            amount: 10,
            category: new Category({
                _id: categoryId,
                name: 'Islamic'
            })
        });

        await purchase.save();
    });

    afterEach(async ()=> {
        await server.close();
        await Purchase.deleteMany({});
    });

    // it('Should generate a new Purchase',async ()=>{
    //     const result = await Purchase.findById(purchase._id);
    //     expect(result).not.toBeNull();
    // });

    it('Should generate a new Purchase',async ()=>{
        const res = await request(server).post('/api/purchases').send({});
        expect(res.status).toBe(400);
    });

});