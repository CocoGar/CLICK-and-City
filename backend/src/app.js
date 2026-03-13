const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Click&City API running" });
});

// Rutas vacías agregadas para categorías y ciudades
app.get("/categories", (req, res) => {
  // TODO: Implement categories logic
  res.json({ message: "Categories endpoint" });
});
// Rutas vacías agregadas para categorías y ciudades
app.get("/cities", (req, res) => {
  // TODO: Implement cities logic
  res.json({ message: "Cities endpoint" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});