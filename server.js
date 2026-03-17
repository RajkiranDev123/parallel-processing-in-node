// index.mjs
import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // fallback to 3000 if PORT not defined

// Middleware to parse JSON
app.use(express.json());

// Simple GET route
app.get("/", (req, res) => {
  res.send("Hello, Express with ES6 and dotenv!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});