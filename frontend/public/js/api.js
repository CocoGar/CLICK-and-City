const API_BASE_URL = "http://localhost:3000/api";

async function searchCities(query) {
  const response = await fetch(
    `${API_BASE_URL}/cities/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Could not fetch cities");
  }

  return await response.json();
}

async function getWeather(city) {
  const response = await fetch(
    `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error("Could not fetch weather");
  }

  return await response.json();
}

async function getPlaces(city, category) {
  const response = await fetch(
    `${API_BASE_URL}/places/${encodeURIComponent(city)}/${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error("Could not fetch places");
  }

  return await response.json();
}