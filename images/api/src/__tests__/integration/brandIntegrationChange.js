const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);

describe('PUT /api/makeup-products/:id', () => {
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

    test('should update an existing makeup product', async () => {
        const testMakeupId = await insertTestMakeupProduct(transaction);

        const updatedMakeupProduct = {
            name: 'Updated Makeup Product',
            brand: 'Updated Brand',
            color:'Updated Color'
        };

        const response = await request(app)
            .put(`/api/makeup-products/${testMakeupId}`)
            .send(updatedMakeupProduct);

        expect(response.status).toBe(200);

        await transaction.rollback();
    }, 10000);

    test('should handle updating a non-existent makeup product', async () => {
        const nonExistentProductId = 999; 

        const response = await request(app)
            .put(`/api/makeup-products/${nonExistentProductId}`)
            .send({
                name: 'Updated Makeup Product',
                brand: 'Updated Brand',
                color:'Updated Color'
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Makeup product not found');

        await transaction.rollback();
    }, 10000);
});

async function insertTestMakeupProduct(transaction) {
    const [testMakeup] = await transaction.table("makeup").insert({
        name: 'Test Makeup',
        brand: 'Test Brand',
        color: 'Test Color'
    }).returning("*");

    return testMakeup.id;
}
