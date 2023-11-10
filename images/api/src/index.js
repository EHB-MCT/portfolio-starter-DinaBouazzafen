const express = require("express");
const app = express();
require('dotenv').config();


const knex = require("knex");
const knexfile = require("./db/knexfile.js")
const db = knex(knexfile.development)


const port = 3000;
app.use(express.json());

app.get("/", async (req, res) => {
  const users = await db.select().from("users");
  res.send(users);
});

app.get("/api/makeup-products", async (req, res) => {
  const makeupProducts = await db.select().from("makeup_products");
  res.json(makeupProducts);
});

app.post("/api/makeup-products", async (req, res) => {
  const { name, brand } = req.body;
  const newMakeupProduct = await db("makeup_products").insert({ name, brand }).returning("*");
  res.json(newMakeupProduct);
});

app.put("/api/makeup-products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, brand } = req.body;
  const updatedMakeupProduct = await db("makeup_products")
    .where({ id })
    .update({ name, brand })
    .returning("*");
  if (updatedMakeupProduct.length === 0) {
    res.status(404).json({ error: "Makeup product not found" });
  } else {
    res.json(updatedMakeupProduct);
  }
});

app.delete("/api/makeup-products/:id", async (req, res) => {
  const { id } = req.params;
  const numDeleted = await db("makeup_products").where({ id }).del();
  if (numDeleted === 0) {
    res.status(404).json({ error: "Makeup product not found" });
  } else {
    res.json({ message: "Makeup product deleted successfully" });
  }
});

app.listen(port, () => {
  console.log(`This server is running on port ${port}`);
});
