const fetch = require("node-fetch");
require("dotenv").config();

const VALID_CATEGORIES = [
  'restaurant', 'bar', 'cafe', 'museum', 'park', 'shop', 'hotel', 'nightclub'
];

module.exports = {
  getPlaces: async (req, res) => {
    const { city, category } = req.params;

    if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
      return res.status(400).json({
        error: `Category "${category}" not recognized`,
        availableCategories: VALID_CATEGORIES,
      });
    }

    const url = `https://places-api.foursquare.com/places/search?near=${encodeURIComponent(city)}&query=${encodeURIComponent(category)}&limit=10`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': process.env.FOURSQUARE_SERVICE_API_KEY,
          'X-Places-Api-Version': '2025-06-17',
        },
      });

      if (!response.ok) {
        return res.status(502).json({ error: "Error fetching places" });
      }

      const data = await response.json();

      const places = (data.results || []).map(place => ({
        name: place.name,
        address: place.location?.formatted_address || null,
        category: place.categories?.[0]?.name || category,
        latitude: place.geocodes?.main?.latitude || null,
        longitude: place.geocodes?.main?.longitude || null,
      }));

      res.json({
        city,
        category,
        total: places.length,
        places,
      });

    } catch (error) {
      console.error("Error fetching places:", error.message);
      res.status(500).json({ error: "Server error fetching places" });
    }
  }
};
