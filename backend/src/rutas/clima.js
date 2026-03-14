const express = require('express');
const router = express.Router();
const { getWeather } = require('../controladores/controladorClima');

router.get('/:city', getWeather);

module.exports = router;