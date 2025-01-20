const request = require('supertest');
const {Book} = require('../../models/book');
let server;

describe('/api/books',()=>{
    //Define happy path, and then in each test, change one
    //parameter that clearly adjust with the name of the test.
    let name;
    beforeEach(()=> {
        server = require('../../index');
        name = 'book1';
    });

    afterEach(async ()=> {
        await server.close();
        await Book.deleteMany({});
    });

    // describe('PUT /', ()=>{
    //     const exec = async () => {
    //         return await request(server)
    //             .put('/api/books')
    //             .send({ title: 'book1', newTitle: 'book2' }); // Pass current and new title
    //     };
 
    //     it('should update the book if its valid',async ()=>{
    //         const res = await exec();

    //         const book = await Book.findOne({ title: 'book2' });
    //         expect(book).not.toBeNull();
    //     });
    // });

    describe('POST /', ()=>{
        const exec = async ()=> {
            return await request(server).
            post('/api/books').
            send({ name });
        }

        it('should save the book if its valid',async ()=>{

            const res = await exec();
            const book = await Book.find({name:'book1'});
            expect(book).not.toBeNull();
        });

        it('should return 400, if book name is more than 50 characters',async ()=>{

            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 book name is less than 5 characters',async ()=>{
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        // it('should return 401 if the client is not logged in',async ()=>{

        //     const res = await exec();
        //     expect(res.status).toBe(401);
        // });
    });

    describe('GET /:id', ()=>{
        it('should return 404',async ()=>{

            const res = await request(server).get('/api/books/1');
            expect(res.status).toBe(404);
        });
    });

    describe('GET /:id', ()=>{
        it('should return the book',async ()=>{
            const result = await Book.collection.insertOne({ name: 'book1' });
            
            // Access _id values from the result
            const insertedId = result.insertedId.toString();

            const res = await request(server).get('/api/books/'+insertedId);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name','book1');
        });
    });

    describe('GET /', ()=>{
        it('should return all book',async ()=>{
            await Book.collection.insertMany([
                {name: 'book1'},
                {name: 'book2'}
            ]);

            const res = await request(server).get('/api/books');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(b => b.name == 'book1')).toBeTruthy();
            expect(res.body.some(b => b.name == 'book2')).toBeTruthy();
        });
    });

    describe('GET /',()=>{
        it('should return all book',async ()=>{
            const res = await request(server).get('/api/books');
            expect(res.status).toBe(200);
        });
    });
});
