const express = require('express');
const router = express.Router();

// Ruta para obtener el clima de una ciudad
// GET /api/weather/:city
router.get('/:city', (req, res) => {
  // TODO: Implementar lógica para obtener el clima usando OpenWeatherMap API
  res.json({ message: `Clima para ${req.params.city}` });
});

module.exports = router;