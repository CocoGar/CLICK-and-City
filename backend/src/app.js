const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Importar rutas
const weatherRoutes = require('./rutas/clima');
const placesRoutes = require('./rutas/lugares');
const citiesRoutes = require('./rutas/ciudades');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz para verificar que la API está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Click&City API running" });
});

// Usar rutas con prefijo /api
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/cities', citiesRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});