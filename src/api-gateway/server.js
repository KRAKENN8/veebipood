const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/*
 helper
*/
async function proxy(req, res, target) {
  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          req.headers.authorization || ""
      },
      body:
        req.method !== "GET" &&
        req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

/*
 HEALTH
*/
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "gateway",
    timestamp: new Date().toISOString()
  });
});

/*
 USERS
*/

app.post("/api/users/signup", (req, res) =>
  proxy(
    req,
    res,
    "http://users:3001/signup"
  )
);

app.post("/api/users/login", (req, res) =>
  proxy(
    req,
    res,
    "http://users:3001/login"
  )
);

app.post("/api/users/logout", (req, res) =>
  proxy(
    req,
    res,
    "http://users:3001/logout"
  )
);

app.get("/api/users/me", (req, res) =>
  proxy(
    req,
    res,
    "http://users:3001/me"
  )
);

app.get("/api/users", (req, res) =>
  proxy(
    req,
    res,
    "http://users:3001/users"
  )
);

/*
 PRODUCTS
*/

app.get("/api/products", (req, res) =>
  proxy(
    req,
    res,
    "http://products:3002/products"
  )
);

app.get(
  "/api/products/categories",
  (req, res) =>
    proxy(
      req,
      res,
      "http://products:3002/products/categories"
    )
);

app.get(
  "/api/products/search",
  (req, res) =>
    proxy(
      req,
      res,
      `http://products:3002/products/search?name=${req.query.name}`
    )
);

app.get(
  "/api/products/category/:cat",
  (req, res) =>
    proxy(
      req,
      res,
      `http://products:3002/products/category/${req.params.cat}`
    )
);

app.get("/api/products/:id", (req, res) =>
  proxy(
    req,
    res,
    `http://products:3002/products/${req.params.id}`
  )
);

/*
 ORDERS
*/

app.post("/api/orders", (req, res) =>
  proxy(
    req,
    res,
    "http://orders:3003/orders"
  )
);

app.get("/api/orders", (req, res) =>
  proxy(
    req,
    res,
    "http://orders:3003/orders"
  )
);

app.get("/api/orders/me", (req, res) =>
  proxy(
    req,
    res,
    "http://orders:3003/orders/me"
  )
);

app.get("/api/orders/:id", (req, res) =>
  proxy(
    req,
    res,
    `http://orders:3003/orders/${req.params.id}`
  )
);

app.patch(
  "/api/orders/:id/status",
  (req, res) =>
    proxy(
      req,
      res,
      `http://orders:3003/orders/${req.params.id}/status`
    )
);

/*
 STATS
*/

app.get("/api/stats", async (req, res) => {
  try {
    const productsRes = await fetch(
      "http://products:3002/products"
    );

    const ordersRes = await fetch(
      "http://orders:3003/orders"
    );

    const usersRes = await fetch(
      "http://users:3001/users"
    );

    const products =
      await productsRes.json();

    const orders =
      await ordersRes.json();

    const users =
      await usersRes.json();

    res.json({
      totalProducts:
        products.products.length,

      totalOrders:
        orders.orders.length,

      totalUsers:
        users.users.length,

      activeOrders:
        orders.orders.filter(
          (o) =>
            o.status !==
            "kohale toimetatud"
        ).length
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log(
    "API Gateway running on 3000"
  );
});