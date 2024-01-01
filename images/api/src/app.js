const { checkBrandName } = require('./helpers/endpointHelpers');
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const knex = require('knex');
const knexfile = require('./db/knexfile.js');
const db = knex(knexfile.development);

app.use(express.json());

app.get('/api/makeup-products', async (req, res) => {
  const makeupProducts = await db.select().from('makeup');
  res.json(makeupProducts);
});

app.post('/api/makeup-products', async (req, res) => {
  const { name, brand, color } = req.body;
  if (checkBrandName(name)) {
    try {
      const newMakeupProduct = await db('makeup').insert({ name, brand, color }).returning('*');
      res.status(201).json(newMakeupProduct);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: 'Something is wrong babygirl',
        value: error,
      });
    }
  } else {
    res.status(401).send({
      message: 'Name is wrongly formatted darling',
    });
  } 
});


app.put('/api/makeup-products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, brand, color } = req.body;

  // Check for missing required fields in the request body
  if (!name || !brand || !color) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const updatedMakeupProduct = await db('makeup')
      .where({ id })
      .update({ name, brand, color })
      .returning('*');

    // Check if the product was found and updated
    if (updatedMakeupProduct.length === 0) {
      res.status(404).json({ error: 'Makeup product not found' });
    } else {
      res.json(updatedMakeupProduct[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'An error occurred while updating the product',
      details: error.message
    });
  }
});


app.delete('/api/makeup-products/:id', async (req, res) => {
  const { id } = req.params;
  const numDeleted = await db('makeup').where({ id }).del();
  if (numDeleted === 0) {
    res.status(404).json({ error: 'Makeup product not found' });
  } else {
    res.json({ message: 'Makeup product deleted successfully' });
  }
});

module.exports = app;
