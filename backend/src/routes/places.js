const express = require("express");
const router = express.Router();
const { getPlaces } = require("../controllers/placesController");

router.get("/:city/:category", getPlaces);

module.exports = router;