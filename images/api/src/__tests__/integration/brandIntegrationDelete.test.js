const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);

let testMakeup = {
    brand: "TEST",
    name: "Chocolate Mint Test"
}

describe('DELETE /api/makeup-products/:id', () => {
    let transaction;

    beforeAll((done) => {
        db.raw("BEGIN");
        db.table("makeup").insert(testMakeup).returning("*").then((data) => {
            if(data[0]) {
                testMakeup["id"] = data[0].id;
                done();
            } else {

            }
        });
    });

    afterAll((done) => {
        db.table("makeup").delete().where({id: testMakeup.id}).then(() =>{

            db.destroy();
            done();
        })

    });

    test('should delete an existing makeup product', async () => {
        const response = await request(app)
            .delete('/api/makeup-products/'+ testMakeup.id) // Replace with a valid makeup product ID from your database

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Makeup product deleted successfully');

        const data = await db.select().table("makeup").where({id: testMakeup});
        expect(data.length).toBe(0)
    });

    test('should handle deleting a non-existent makeup product', async () => {

        const data = await db.table("makeup").select();
        const preLength = data.length;

        const nonExistentProductId = 999; // Replace with an invalid ID

        const response = await request(app)
            .delete(`/api/makeup-products/${nonExistentProductId}`)

        expect(response.status).toBe(404);

        const afterData = await db.table("makeup").select();
        const afterLength = data.length;

        expect(preLength).toEqual(afterLength);
    });
});

