const express = require("express");
const cors = require("cors");
const fetchDataMiddleware = require("./middleware/fetchDataMiddleware");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/dbConfig");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(fetchDataMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", userRoutes);

module.exports = app;
