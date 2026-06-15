const express = require("express");
const cors = require("cors");
const data = require("./data");

const app = express();

app.use(cors());
app.use(express.json());

async function getUser(token) {
  const res = await fetch(
    "http://users:3001/validate",
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!res.ok) return null;

  return await res.json();
}

async function getProduct(productId) {
  const res = await fetch(
    `http://products:3002/internal/products/${productId}`
  );

  if (!res.ok) return null;

  return await res.json();
}

async function reduceStock(productId, quantity) {
  const res = await fetch(
    "http://products:3002/internal/products/reduce-stock",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        quantity
      })
    }
  );

  return res.ok;
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/*
 CREATE ORDER
*/
app.post("/orders", async (req, res) => {
  const token = req.headers.authorization;

  const user = await getUser(token);

  if (!user) {
    return res.status(401).json({
      error: "Pead olema sisse logitud"
    });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "Vajalik väli: items"
    });
  }

  const orderItems = [];

  for (const item of items) {
    const product = await getProduct(
      item.productId
    );

    if (!product) {
      return res.status(404).json({
        error: `Toodet ID ${item.productId} ei leitud`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(409).json({
        error: `Toode "${product.name}" pole piisavalt laos`
      });
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  /*
   уменьшаем остаток
  */
  for (const item of items) {
    await reduceStock(
      item.productId,
      item.quantity
    );
  }

  const total = orderItems.reduce(
    (sum, i) =>
      sum + i.price * i.quantity,
    0
  );

  const order = {
    id: data.nextOrderId++,
    userId: user.id,
    userName: user.name,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    status: "vastu võetud",
    createdAt: new Date().toISOString()
  };

  data.orders.push(order);

  res.status(201).json({
    message: "Tellimus loodud!",
    order
  });
});

/*
 ALL ORDERS
*/
app.get("/orders", (req, res) => {
  res.json({
    orders: data.orders
  });
});

/*
 USER ORDERS
*/
app.get("/orders/me", async (req, res) => {
  const token =
    req.headers.authorization;

  const user = await getUser(token);

  if (!user) {
    return res.status(401).json({
      error: "Pead olema sisse logitud"
    });
  }

  const orders = data.orders.filter(
    (o) => o.userId === user.id
  );

  res.json({
    orders,
    count: orders.length
  });
});

/*
 ORDER BY ID
*/
app.get("/orders/:id", (req, res) => {
  const order = data.orders.find(
    (o) =>
      o.id ===
      parseInt(req.params.id)
  );

  if (!order) {
    return res.status(404).json({
      error: "Tellimust ei leitud"
    });
  }

  res.json(order);
});

/*
 UPDATE STATUS
*/
app.patch(
  "/orders/:id/status",
  (req, res) => {
    const { status } = req.body;

    const validStatuses = [
      "vastu võetud",
      "töötlemisel",
      "saadetud",
      "kohale toimetatud"
    ];

    if (
      !status ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        error:
          "Kehtetu staatus"
      });
    }

    const order = data.orders.find(
      (o) =>
        o.id ===
        parseInt(req.params.id)
    );

    if (!order) {
      return res.status(404).json({
        error: "Tellimust ei leitud"
      });
    }

    order.status = status;

    res.json({
      message:
        "Staatus uuendatud!",
      order
    });
  }
);

app.listen(3003, () => {
  console.log(
    "Order Service running on 3003"
  );
});