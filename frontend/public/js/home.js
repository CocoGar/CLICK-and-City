const cityInput = document.getElementById("cityInput");
const suggestionsList = document.getElementById("suggestionsList");

// Variable para controlar el temporizador
let debounceTimer;

cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();

  clearTimeout(debounceTimer);

  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      console.log(`Buscando sugerencias para: ${query}...`);
      const cities = await searchCities(query);
      renderSuggestions(cities);
    } catch (error) {
      console.error("Error al buscar ciudades:", error);
      suggestionsList.innerHTML = "<li>Error al cargar sugerencias</li>";
    }
  }, 500);
});

function renderSuggestions(cities) {
  suggestionsList.innerHTML = "";

  if (!cities || !cities.length) {
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
