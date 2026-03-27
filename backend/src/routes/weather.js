const express = require("express");
const router = express.Router();
const { getWeather, getForecast } = require("../controllers/weatherController");

router.get("/forecast", getForecast);
router.get("/", getWeather);

module.exports = router;
