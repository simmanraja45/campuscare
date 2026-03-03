const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("CampusCare backend running 🚀");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "API is working" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});