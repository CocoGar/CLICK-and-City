const express = require('express');
const router = express.Router();

// Ruta para buscar sugerencias de ciudades
// GET /api/cities/search?q=...
router.get('/search', (req, res) => {
  const query = req.query.q;
  // TODO: Implementar lógica para autocompletar ciudades usando GeoDB Cities API
  res.json({ message: `Buscar ciudades para ${query}` });
});

module.exports = router;