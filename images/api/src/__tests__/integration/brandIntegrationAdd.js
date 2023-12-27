const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);
describe('POST /api/makeup-products', () => {
    afterAll((done) => {
        // Clean up any test data
        db.table("makeup").delete().where({ name: testMakeup.name, brand: testMakeup.brand });

        db.destroy();
        done();
    });

    test('should create a new makeup product', async () => {
        const response = await request(app)
            .post('/api/makeup-products')
            .send({
                name: 'New Makeup Product',
                brand: 'New Brand',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Brand is successfully created :)');
    });

    test('should handle creating a makeup product with invalid data', async () => {
        const response = await request(app)
            .post('/api/makeup-products')
            .send({
                name: '',
                brand: 'Invalid Brand',
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Name is wrongly formatted darling');
    });
});

