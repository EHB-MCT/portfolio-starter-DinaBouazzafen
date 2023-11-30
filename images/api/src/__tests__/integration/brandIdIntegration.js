const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);

describe('GET /api/makeup-products/:id', () => {
    let transaction;

    beforeEach(async () => {
        //transaction = await db.transaction();
    });

    afterEach(async () => {
        // await transaction.rollback();
    });

    afterAll(async () => {
        await db.destroy();
    });

    test('should return the correct name for a makeup product', async () => {
        const response = await request(app).get('/api/makeup-products/1'); // Replace with a valid makeup product ID from your database

        expect(response.status).toBe(200);
        expect(response.body.name).toBeDefined(); // Check if the 'name' property exists in the response
    });

    test('should handle invalid makeup product IDs', async () => {
        const invalidProductId = 999; // Replace with an invalid ID

        const response = await request(app).get(`/api/makeup-products/${invalidProductId}`);

        expect(response.status).toBe(404);
    });
});

describe('POST /api/makeup-products', () => {
    let transaction;

    beforeEach(async () => {
        // transaction = await db.transaction();
    });

    afterEach(async () => {
        // await transaction.rollback();
    });

    afterAll(async () => {
        await db.destroy();
    });

    test('should create a new makeup product', async () => {
        const newMakeupProduct = {
            name: 'Test Product',
            brand: 'Test Brand',
        };

        const response = await request(app)
            .post('/api/makeup-products')
            .send(newMakeupProduct);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Brand is successfully created :)');
    });

    test('should handle invalid input data', async () => {
        const invalidMakeupProduct = {
            name: '', // Invalid name
            brand: 'Test Brand',
        };

        const response = await request(app)
            .post('/api/makeup-products')
            .send(invalidMakeupProduct);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Name is wrongly formatted darling');
    });
});

describe('PUT /api/makeup-products/:id', () => {
    let transaction;

    beforeEach(async () => {
        // transaction = await db.transaction();
    });

    afterEach(async () => {
        // await transaction.rollback();
    });

    afterAll(async () => {
        await db.destroy();
    });

    test('should update an existing makeup product', async () => {
        const updatedMakeupProduct = {
            name: 'Updated Product Name',
            brand: 'Updated Brand',
        };

        const response = await request(app)
            .put('/api/makeup-products/1') // Replace with a valid makeup product ID from your database
            .send(updatedMakeupProduct);

        expect(response.status).toBe(200);
    });

    test('should handle updating a non-existent makeup product', async () => {
        const updatedMakeupProduct = {
            name: 'Updated Product Name',
            brand: 'Updated Brand',
        };

        const nonExistentProductId = 999; // Replace with an invalid ID

        const response = await request(app)
            .put(`/api/makeup-products/${nonExistentProductId}`)
            .send(updatedMakeupProduct);

        expect(response.status).toBe(404);
    });
});

describe('DELETE /api/makeup-products/:id', () => {
    let transaction;

    beforeEach(async () => {
        // transaction = await db.transaction();
    });

    afterEach(async () => {
        // await transaction.rollback();
    });

    afterAll(async () => {
        await db.destroy();
    });

    test('should delete an existing makeup product', async () => {
        const response = await request(app)
            .delete('/api/makeup-products/1') // Replace with a valid makeup product ID from your database

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Makeup product deleted successfully');
    });

    test('should handle deleting a non-existent makeup product', async () => {
        const nonExistentProductId = 999; // Replace with an invalid ID

        const response = await request(app)
            .delete(`/api/makeup-products/${nonExistentProductId}`)

        expect(response.status).toBe(404);
    });
});

