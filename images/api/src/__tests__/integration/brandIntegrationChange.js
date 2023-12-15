const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);

describe('PUT /api/makeup-products/:id', () => {
    let testMakeup;

    beforeAll(async (done) => {
        // Insert a test makeup product
        testMakeup = await db.table("makeup").insert(testMakeup).returning("*");

        done();
    });

    afterAll(async (done) => {
        // Delete the test makeup product
        await db.table("makeup").delete().where({ id: testMakeup[0].id });

        db.destroy();
        done();
    });

    test('should update an existing makeup product', async () => {
        const response = await request(app)
            .put(`/api/makeup-products/${testMakeup[0].id}`)
            .send({
                name: 'Updated Makeup Product',
                brand: 'Updated Brand',
            });

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        // Add additional assertions based on your data model
    });

    test('should handle updating a non-existent makeup product', async () => {
        const nonExistentProductId = 999; // Replace with an invalid ID

        const response = await request(app)
            .put(`/api/makeup-products/${nonExistentProductId}`)
            .send({
                name: 'Updated Makeup Product',
                brand: 'Updated Brand',
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Makeup product not found');
    });
});
