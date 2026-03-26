const axios = require("axios");

const searchCities = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await axios.get(
      "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      {
        params: {
          namePrefix: query,
          limit: 5
        },
        headers: {
          "X-RapidAPI-Key": process.env.GEODB_API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
        }
      }
    );

    const cities = response.data.data.map((city) => ({
      name: city.city,
      country: city.country
    }));

    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error.response?.data || error.message);
    res.status(500).json({ error: "Error fetching cities" });
  }
};

module.exports = { searchCities };