const fetch = require("node-fetch");
require("dotenv").config();

module.exports = {
  getWeather: async (req, res) => {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPEN_WEATHER_ACCESS_KEY}&units=metric&lang=es`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod == 401) {
        return res.status(401).json({ error: "Invalid OpenWeather API key" });
      }

      if (data.cod == 404) {
        return res.status(404).json({ error: `City "${city}" not found` });
      }

      if (data.cod != 200) {
        return res.status(500).json({ error: "Error retrieving weather data" });
      }

      res.json({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    } catch (error) {
      res.status(500).json({ error: "Error connecting to OpenWeather API" });
    }
  },

  getForecast: async (req, res) => {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${process.env.OPEN_WEATHER_ACCESS_KEY}&units=metric&lang=en&cnt=40`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== "200") {
        return res.status(404).json({ error: `City "${city}" not found` });
      }

      const dias = {};
      data.list.forEach((item) => {
        const fecha = item.dt_txt.split(" ")[0];
        const hora = item.dt_txt.split(" ")[1];
        if (hora === "12:00:00" || (!dias[fecha] && hora > "10:00:00")) {
          dias[fecha] = {
            date: fecha,
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          };
        }
      });

      res.json(Object.values(dias).slice(0, 5));
    } catch (error) {
      res.status(500).json({ error: "Error connecting to OpenWeather API" });
    }
  },
};
