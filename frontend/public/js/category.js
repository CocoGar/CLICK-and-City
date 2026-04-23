const BACKEND = "http://localhost:3000";

const params = new URLSearchParams(window.location.search);
const cityName = params.get("city");
const categoryType = params.get("type");

if (!cityName || !categoryType) {
  window.location.href = "index.html";
}

function $(id) {
  return document.getElementById(id);
}

function showError(message) {
  const errorBox = $("categoryErrorBox");
  const errorText = $("categoryErrorText");

  if (errorBox && errorText) {
    errorText.textContent = message;
    errorBox.classList.remove("hidden");
  }
}

function formatCategory(type) {
  switch (type) {
    case "restaurant":
      return "Gastronomía";
    case "museum":
      return "Ocio y cultura";
    case "park":
      return "Parques y naturaleza";
    case "shop":
      return "Compras";
    default:
      return "Categoría";
  }
}

function renderHeader() {
  $("categoryTitle").textContent = formatCategory(categoryType);
  $("categorySubtitle").textContent = cityName;
}

function renderPlaces(places) {
  const grid = $("placesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!places.length) {
    grid.innerHTML = `
      <article class="place-card empty-card">
        <h2>No hay datos disponibles</h2>
        <p>No se encontraron lugares para esta categoría.</p>
      </article>
    `;
    return;
  }

  places.forEach((place) => {
    const article = document.createElement("article");
    article.className = "place-card";

    article.innerHTML = `
      <h2 class="place-name">${place.name}</h2>
      ${place.category ? `<p class="place-category">${place.category}</p>` : ""}
      ${place.address ? `<p class="place-address">${place.address}</p>` : ""}
      <div class="place-meta">
        ${
          place.latitude != null && place.longitude != null
            ? `<span>📍 ${place.latitude}, ${place.longitude}</span>`
            : `<span>📍 Coordinates not available</span>`
        }
      </div>
    `;

    grid.appendChild(article);
  });
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function loadCategory() {
  try {
    renderHeader();

    const data = await fetchJson(
      `${BACKEND}/api/places/${encodeURIComponent(cityName)}/${encodeURIComponent(categoryType)}`,
    );

    renderPlaces(data.places || []);
  } catch (error) {
    console.error(error);
    showError("Could not load places for this category");
    renderPlaces([]);
  }
}

loadCategory();
