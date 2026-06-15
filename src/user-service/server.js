const express = require("express");
const cors = require("cors");
const data = require("./data");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/signup", (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({
      error: "Vajalikud väljad: username, password, name"
    });
  }

  if (data.users.find(u => u.username === username)) {
    return res.status(409).json({
      error: "Kasutajanimi on juba olemas"
    });
  }

  const user = {
    id: data.nextUserId++,
    username,
    password,
    name
  };

  data.users.push(user);

  const token = `token_${user.id}_${Date.now()}`;

  data.sessions[token] = user.id;

  res.status(201).json({
    message: "Kasutaja loodud!",
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = data.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: "Vale kasutajanimi või parool"
    });
  }

  const token = `token_${user.id}_${Date.now()}`;

  data.sessions[token] = user.id;

  res.json({
    message: "Sisselogimine õnnestus!",
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name
    }
  });
});

app.post("/logout", (req, res) => {
  const token = req.headers.authorization;

  if (token && data.sessions[token]) {
    delete data.sessions[token];
  }

  res.json({
    message: "Välja logitud!"
  });
});

app.get("/me", (req, res) => {
  const token = req.headers.authorization;

  const userId = data.sessions[token];

  if (!userId) {
    return res.status(401).json({
      error: "Pole sisse logitud"
    });
  }

  const user = data.users.find(u => u.id === userId);

  res.json({
    id: user.id,
    username: user.username,
    name: user.name
  });
});

app.get("/users", (req, res) => {
  res.json({
    users: data.users.map(u => ({
      id: u.id,
      username: u.username,
      name: u.name
    }))
  });
});

/*
 внутренний endpoint для Order Service
*/
app.get("/validate", (req, res) => {
  const token = req.headers.authorization;

  const userId = data.sessions[token];

  if (!userId) {
    return res.status(401).json({
      error: "Pole sisse logitud"
    });
  }

  const user = data.users.find(u => u.id === userId);

  res.json(user);
});

app.listen(3001, () => {
  console.log("User Service running on 3001");
});