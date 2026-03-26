const cityInput = document.getElementById("cityInput");
const suggestionsList = document.getElementById("suggestionsList");

cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();

  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    return;
  }

  try {
    const cities = await searchCities(query);
    renderSuggestions(cities);
  } catch (error) {
    console.error("Error al buscar ciudades:", error);
    suggestionsList.innerHTML = "<li>Error al cargar sugerencias</li>";
  }
});

function renderSuggestions(cities) {
  suggestionsList.innerHTML = "";

  if (!cities.length) {
    suggestionsList.innerHTML = "<li>No se encontraron ciudades</li>";
    return;
  }

  cities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;

    li.addEventListener("click", () => {
      cityInput.value = city.name;
      suggestionsList.innerHTML = "";
      window.location.href = `city.html?city=${encodeURIComponent(city.name)}`;
    });

    suggestionsList.appendChild(li);
  });
}