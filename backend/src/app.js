const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const citiesRoutes = require("./routes/cities");
const weatherRoutes = require("./routes/weather");
const placesRoutes = require("./routes/places");
const photoRoutes = require("./routes/photo");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/cities", citiesRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/photo", photoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Click&City API running" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
