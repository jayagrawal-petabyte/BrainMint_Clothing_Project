require("dotenv").config();

const express = require("express");

const cors = require("cors");

const connectDB =
require("./src/config/db");

const authRoutes =
require("./src/routes/authRoutes");

const app = express();

const contactRoutes =
require("./src/routes/contactRoutes");

// Connect database
connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contact",contactRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});