const express = require("express");
const cors = require("cors");
const data = require("./data");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/products", (req, res) => {
  res.json({ products: data.products });
});

app.get("/products/categories", (req, res) => {
  const categories = [
    ...new Set(data.products.map((p) => p.category))
  ];

  res.json({ categories });
});

app.get("/products/category/:cat", (req, res) => {
  const cat = req.params.cat.toLowerCase();

  const products = data.products.filter(
    (p) => p.category.toLowerCase() === cat
  );

  if (products.length === 0) {
    return res.status(404).json({
      error: "Selle kategooriaga tooteid ei leitud"
    });
  }

  res.json({
    products,
    count: products.length
  });
});

app.get("/products/search", (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      error: "Lisa parameeter ?name=..."
    });
  }

  const results = data.products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json({
    results,
    count: results.length
  });
});

app.get("/products/:id", (req, res) => {
  const product = data.products.find(
    (p) => p.id === parseInt(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      error: "Toodet ei leitud"
    });
  }

  res.json(product);
});

/*
 внутренний endpoint
 для Order Service
*/
app.get("/internal/products/:id", (req, res) => {
  const product = data.products.find(
    (p) => p.id === parseInt(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      error: "Toodet ei leitud"
    });
  }

  res.json(product);
});

app.post("/internal/products/reduce-stock", (req, res) => {
  const { productId, quantity } = req.body;

  const product = data.products.find(
    (p) => p.id === productId
  );

  if (!product) {
    return res.status(404).json({
      error: "Toodet ei leitud"
    });
  }

  if (product.stock < quantity) {
    return res.status(409).json({
      error: "Pole piisavalt laos"
    });
  }

  product.stock -= quantity;

  res.json({
    success: true,
    stock: product.stock
  });
});

app.listen(3002, () => {
  console.log("Product Service running on 3002");
});