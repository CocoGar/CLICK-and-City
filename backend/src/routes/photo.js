const express = require("express");
const router = express.Router();
const { getPhoto } = require("../controllers/photoController");

router.get("/:city", getPhoto);

module.exports = router;
