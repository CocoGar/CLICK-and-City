const express = require("express");
const router = express.Router();
const { searchCities } = require("../controllers/citiesController");

router.get("/search", searchCities);

module.exports = router;