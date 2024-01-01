const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);

describe('DELETE /api/makeup-products/:id', () => {
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

    test('should delete an existing makeup product', async () => {
        const testMakeup = await insertTestMakeupProduct(transaction);

        const response = await request(app)
            .delete(`/api/makeup-products/${testMakeup.id}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Makeup product deleted successfully');

        const data = await transaction.select().table("makeup").where({id: testMakeup.id});
        expect(data.length).toBe(0);

        await transaction.rollback();
    }, 10000);

    test('should handle deleting a non-existent makeup product', async () => {
        const nonExistentProductId = 999; 

        const response = await request(app)
            .delete(`/api/makeup-products/${nonExistentProductId}`);

        expect(response.status).toBe(404);

        await transaction.rollback();
    }, 10000);
});

async function insertTestMakeupProduct(transaction) {
    const [testMakeup] = await transaction.table("makeup").insert({
        name: 'Test Makeup',
        brand: 'Test Brand',
        color: 'Test Color'
    }).returning("*");

    return testMakeup;
}

