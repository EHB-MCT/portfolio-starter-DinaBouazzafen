const request = require('supertest');
const app = require('./../../app.js'); // Replace with the path to your Express app
const knexfile = require('./../../db/knexfile.js'); // Replace with the path to your Knex configuration
const db = require("knex")(knexfile.development);


describe('GET /api/makeup-products/:id', () => {
    // Before running the tests, you can seed your database with test data
    beforeAll(async () => {
      await db.raw('BEGIN');
      // Add code here to seed your database with test data if needed
    });
  
    // After the tests, you can clean up the database
    afterAll(async () => {
      await db.destroy();
      // Add code here to clean up any test data if needed
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
