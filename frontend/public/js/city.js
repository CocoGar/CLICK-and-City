const BACKEND = "http://localhost:3000";

const params = new URLSearchParams(window.location.search);
const cityName = params.get("city");

if (!cityName) {
  window.location.href = "index.html";
}

function $(id) {
  return document.getElementById(id);
}

function showError(message) {
  const errorBox = $("errorBox");
  const errorText = $("errorText");

  if (errorBox && errorText) {
    errorText.textContent = message;
    errorBox.classList.remove("hidden");
  }
}

/* ================= HERO ================= */

const TRADUCCIONES = {
  "cielo claro": "Despejado",
  "algo de nubes": "Algo nublado",
  "nubes dispersas": "Parcialmente nublado",
  "muy nuboso": "Muy nublado",
  "cielo cubierto": "Nublado",
  "lluvia ligera": "Lluvia ligera",
  "lluvia moderada": "Lluvia moderada",
  "lluvia fuerte": "Lluvia fuerte",
  llovizna: "Llovizna",
  tormenta: "Tormenta",
  "nieve ligera": "Nieve ligera",
  nieve: "Nieve",
  niebla: "Niebla",
  neblina: "Neblina",
  bruma: "Bruma",
};

function traducirDesc(desc) {
  const lower = desc.toLowerCase();
  return TRADUCCIONES[lower] || lower.charAt(0).toUpperCase() + lower.slice(1);
}

function renderHero(city, weather) {
  const hero = $("heroContent");
  if (!hero) return;

  hero.innerHTML = `
    <div class="city-tag">${weather?.country || ""}</div>
    <h1 class="city-name">${city}</h1>
    ${
      weather
        ? `
        <div class="city-meta">
          <div class="weather-pill">
            <img src="https://openweathermap.org/img/wn/${weather.icon}.png" width="24" alt="${weather.description}" />
            <span class="temp">${Math.round(weather.temperature)}°C</span>
            <span>${traducirDesc(weather.description)}</span>
          </div>
        </div>
      `
        : ""
    }
  `;
}
/* ================= CARDS ================= */

function renderCards(weather, forecast, places) {
  const grid = $("cardsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  // WEATHER CARD
  const weatherCard = document.createElement("div");
  weatherCard.className = "card card-wide";

  weatherCard.innerHTML = `
  <div class="card-header">
    <div class="card-icon">🌤️</div>
    <h2 class="card-title">Clima</h2>
  </div>
  <div class="card-body weather-split">

    <div class="weather-split-today">
      ${
        weather
          ? `
          <div class="card-temp">${Math.round(weather.temperature)}°C</div>
          <p class="card-temp-desc">${traducirDesc(weather.description).charAt(0).toUpperCase() + traducirDesc(weather.description).slice(1)}</p>
          <div class="card-weather-details">
            <span>💧 ${weather.humidity}%</span>
            <span>💨 ${weather.wind}</span>
            <span>🌡️ ${Math.round(weather.feelsLike)}°C</span>
          </div>
          `
          : `<p class="card-text">No hay datos disponibles</p>`
      }
    </div>

    <div class="weather-split-forecast">
      ${
        forecast && forecast.length
          ? `
          <div class="forecast-title">Próximos 5 días</div>
          ${forecast
            .map((day) => {
              const DIAS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
              const hoy = new Date().toISOString().split("T")[0];
              const fecha = new Date(day.date + "T12:00:00");
              const nombreDia =
                day.date === hoy ? "Hoy" : DIAS_ES[fecha.getDay()];
              return `
                <div class="forecast-row">
                  <span class="forecast-day">${nombreDia}</span>
                  <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
                  <span class="forecast-temp-max">${Math.round(day.tempMax)}°</span>
                  <span class="forecast-temp-min">${Math.round(day.tempMin)}°</span>
                </div>
              `;
            })
            .join("")}
          `
          : `<p class="card-text">No hay datos disponibles</p>`
      }
    </div>

  </div>
`;

  grid.appendChild(weatherCard);

  const categories = [
    { key: "restaurant", title: "Gastronomía 🍽️" },
    { key: "museum", title: "Ocio 🎭" },
    { key: "park", title: "Parques 🌿" },
    { key: "shop", title: "Compras 🛍️" },
  ];

  categories.forEach((category) => {
    const card = document.createElement("div");
    card.className = "card";

    const items = places?.[category.key] || [];

    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon">📍</div>
        <h2 class="card-title">${category.title}</h2>
      </div>
      <div class="card-body">
        ${
          items.length
            ? `
            <ul class="card-list">
              ${items
                .slice(0, 6)
                .map(
                  (place) => `
                <li>
                  <div class="lugar-info">
                    <span class="lugar-nombre">${place.name}</span>
                    ${place.category ? `<span class="lugar-categoria">${place.category}</span>` : ""}
                    ${place.address ? `<span class="lugar-direccion">${place.address}</span>` : ""}
                  </div>
                </li>
              `,
                )
                .join("")}
            </ul>
          `
            : `<p class="card-text">No hay datos disponibles</p>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ================= HELPERS ================= */

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

/* ================= LOAD CITY ================= */

async function loadCity() {
  try {
    let weather = null;
    let forecast = null;
    let places = {
      restaurant: [],
      museum: [],
      park: [],
      shop: [],
    };

    // WEATHER ✅
    try {
      weather = await fetchJson(
        `${BACKEND}/api/weather?city=${encodeURIComponent(cityName)}`,
      );
    } catch (error) {
      console.warn("Weather not available:", error.message);
    }

    // FORECAST ❌ opcional por ahora
    try {
      forecast = await fetchJson(
        `${BACKEND}/api/weather/forecast?city=${encodeURIComponent(cityName)}`,
      );
    } catch (error) {
      console.warn("Forecast not available:", error.message);
      forecast = null;
    }

    // PHOTO ❌ opcional por ahora
    try {
      const photoData = await fetchJson(
        `${BACKEND}/api/photo/${encodeURIComponent(cityName)}`,
      );

      if (photoData?.urls?.regular) {
        buildSimpleBackground(photoData.urls.regular);
      }
    } catch (error) {
      console.warn("Photo not available:", error.message);
    }

    // PLACES ✅
    try {
      const [restaurantRes, museumRes, parkRes, shopRes] = await Promise.all([
        fetchJson(
          `${BACKEND}/api/places/${encodeURIComponent(cityName)}/restaurant`,
        ),
        fetchJson(
          `${BACKEND}/api/places/${encodeURIComponent(cityName)}/museum`,
        ),
        fetchJson(`${BACKEND}/api/places/${encodeURIComponent(cityName)}/park`),
        fetchJson(`${BACKEND}/api/places/${encodeURIComponent(cityName)}/shop`),
      ]);

      places.restaurant = restaurantRes.places || [];
      places.museum = museumRes.places || [];
      places.park = parkRes.places || [];
      places.shop = shopRes.places || [];
    } catch (error) {
      console.warn("Places not available:", error.message);
    }

    renderHero(cityName, weather);
    renderCards(weather, forecast, places);
  } catch (error) {
    console.error(error);
    showError(`Could not load information for ${cityName}`);
  }
}

function buildSimpleBackground(imageUrl) {
  const carousel = $("carousel");
  if (!carousel) return;

  carousel.innerHTML = `
    <div class="carousel-slide active" style="background-image: url('${imageUrl}')"></div>
  `;
}

loadCity();
