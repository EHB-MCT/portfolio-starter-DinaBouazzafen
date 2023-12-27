const request = require('supertest');
const app = require('./../../app.js'); 
const knexfile = require('./../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);

describe('POST /api/makeup-products', () => {
    let transaction;

    beforeEach(async () => {
        transaction = await db.transaction();
    });

    afterEach(async () => {
        await transaction.rollback();
    });

    afterAll(async () => {
        await db.destroy();
    });

    test('should create a new makeup product', async () => {
        const newMakeupProduct = {
            name: 'Eyeshadow',
            brand: 'Huda Beauty',
            color: 'Blue'
        };

        const response = await request(app)
            .post('/api/makeup-products')
            .send(newMakeupProduct);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Brand is successfully created :)');

        // Rollback the transaction to undo the test data creation
        await transaction.rollback();
    }, 10000);

    test('should handle creating a makeup product with invalid data', async () => {
        const invalidMakeupProduct = {
            name: '',
            brand: 'Not really real brand',
        };

        const response = await request(app)
            .post('/api/makeup-products')
            .send(invalidMakeupProduct);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Name is wrongly formatted darling');

        // Rollback the transaction to ensure test isolation
        await transaction.rollback();
    }, 10000);
});


