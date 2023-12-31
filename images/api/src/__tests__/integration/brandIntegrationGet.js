const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);
describe('GET /api/makeup-products', () => {
    let testMakeup;

    beforeAll(async (done) => {
        // Insert a test makeup product
        testMakeup = await db.table("makeup").insert({
            name: 'Test Get Makeup',
            brand: 'Test Get Brand',
            color: 'Test Get Color'
        }).returning("*");

        done();
    });

    afterAll(async (done) => {
        // Delete the test makeup product
        await db.table("makeup").delete().where({ id: testMakeup[0].id });

        db.destroy();
        done();
    }, 50000);

    test('should retrieve all makeup products', async () => {
        const response = await request(app)
            .get('/api/makeup-products');

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    }, 50000);
});
