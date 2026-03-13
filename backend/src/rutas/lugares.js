const express = require('express');
const router = express.Router();

// Ruta para obtener lugares por ciudad y categoría
// GET /api/places/:city/:category
router.get('/:city/:category', (req, res) => {
  // TODO: Implementar lógica para obtener lugares usando Foursquare Places API
  res.json({ message: `Lugares en ${req.params.city} para ${req.params.category}` });
});

module.exports = router;