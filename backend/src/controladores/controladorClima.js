const fetch = require('node-fetch');

module.exports = {
  getWeather: async (req, res) => {
    const { city } = req.params;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=es`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        return res.status(404).json({ error: `Ciudad "${city}" no encontrada` });
      }

      res.json({
        ciudad: data.name,
        pais: data.sys.country,
        temperatura: data.main.temp,
        sensacion: data.main.feels_like,
        descripcion: data.weather[0].description,
        icono: data.weather[0].icon,
        humedad: data.main.humidity,
        viento: data.wind.speed
      });

    } catch (error) {
      res.status(500).json({ error: 'Error al conectar con OpenWeatherMap' });
    }
  }
};