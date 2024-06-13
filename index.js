require("dotenv").config();

const axios = require("axios");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();

const PORT = process.env.PORT;
const PGUSER = process.env.PGUSER;
const PGHOST = process.env.PGHOST;
const PGDATABASE = process.env.PGDATABASE;
const PGPASSWORD = process.env.PGPASSWORD;
const PGPORT = process.env.PGPORT;

const pool = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
});

let usersData = null;

const fetchDataMiddleware = async (req, res, next) => {
  let client;
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const fetchedUsers = response.data;

    // Check if the users table is empty
    client = await pool.connect();
    const result = await client.query("SELECT COUNT(*) FROM users");
    const rowCount = parseInt(result.rows[0].count);

    if (rowCount === 0) {
      // Insert fetched data into the users table
      for (let user of fetchedUsers) {
        await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
          user.name,
          user.email,
        ]);
      }
    }

    usersData = fetchedUsers;
  } catch (error) {
    console.error("Error fetching or inserting users data:", error);
    usersData = [];
  } finally {
    if (client) {
      client.release();
    }
  }

  next();
};

app.use(cors());
app.use(express.json());

app.use(fetchDataMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
