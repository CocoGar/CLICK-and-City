const fetch = require("node-fetch");
require("dotenv").config();

module.exports = {
  getPhoto: async (req, res) => {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " city")}&per_page=1&orientation=landscape`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        return res.status(502).json({ error: "Error fetching photo from Unsplash" });
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return res.status(404).json({ error: `No photo found for "${city}"` });
      }

      const photo = data.results[0];

      res.json({
        urls: {
          regular: photo.urls.regular,
          small: photo.urls.small,
        },
        alt: photo.alt_description,
        credit: {
          name: photo.user.name,
          link: photo.user.links.html,
        },
      });
    } catch (error) {
      console.error("Error fetching photo:", error.message);
      res.status(500).json({ error: "Server error fetching photo" });
    }
  },
};
