import express from "express";
import session from "express-session";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "omasalasana",
  database: "logindemo"
});

db.connect(err => {
  if (err) throw err;
  console.log("DB connected");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Palvelinvirhe" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Käyttäjää ei löytynyt" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Väärä salasana" });
    }

    req.session.user = {
      id: user.id,
      username: user.username
    };

    res.json({
      message: "Kirjautuminen onnistui",
      user: req.session.user
    });
  });
});

app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      loggedIn: false,
      user: null
    });
  }

  res.json({
    loggedIn: true,
    user: req.session.user
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Uloskirjautuminen epäonnistui" });
    }

    res.clearCookie("connect.sid");

    res.json({
      message: "Kirjauduttu ulos"
    });
  });
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});