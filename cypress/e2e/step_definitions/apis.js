import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

const BASE_URL = "http://127.0.0.1:5500/frontend/public/index.html";
const CITY = "Madrid";
const COMMAND_DELAY = 1000;

Cypress.on("command:enqueued", (obj) => {
  if (COMMAND_DELAY > 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, COMMAND_DELAY);
    });
  }
});

beforeEach(() => {
  cy.wrap(null).as("weatherData");
  cy.wrap(null).as("photoData");
  cy.wrap(null).as("restaurantData");
  cy.wrap(null).as("museumData");
  cy.wrap(null).as("parkData");
  cy.wrap(null).as("shopData");
});

Given("el usuario ha buscado la ciudad {string}", (ciudad) => {
  cy.intercept("GET", "**/api/weather?**").as("weatherCall");
  cy.intercept("GET", "**/api/weather/forecast**").as("forecastCall");
  cy.intercept("GET", "**/api/photo/**").as("photoCall");
  cy.intercept("GET", "**/api/places/**/restaurant").as("restaurantCall");
  cy.intercept("GET", "**/api/places/**/museum").as("museumCall");
  cy.intercept("GET", "**/api/places/**/park").as("parkCall");
  cy.intercept("GET", "**/api/places/**/shop").as("shopCall");

  cy.visit(
    `http://127.0.0.1:5500/frontend/public/city.html?city=${encodeURIComponent(ciudad)}&t=${Date.now()}`,
  );

  cy.wait("@weatherCall", { timeout: 10000 })
    .its("response.body")
    .as("weatherData");
  cy.wait("@forecastCall", { timeout: 10000 })
    .its("response.body")
    .as("forecastData");
  cy.wait("@photoCall", { timeout: 10000 })
    .its("response.body")
    .as("photoData");
  cy.wait("@restaurantCall", { timeout: 10000 })
    .its("response.body")
    .as("restaurantData");
  cy.wait("@museumCall", { timeout: 10000 })
    .its("response.body")
    .as("museumData");
  cy.wait("@parkCall", { timeout: 10000 }).its("response.body").as("parkData");
  cy.wait("@shopCall", { timeout: 10000 }).its("response.body").as("shopData");
});

// ---- CLIMA ----

Then(
  "el clima mostrado en la tarjeta corresponde con la respuesta de la API",
  () => {
    cy.get("@weatherData").then((body) => {
      const temp = Math.round(body.temperature);
      cy.get(".card-temp").should("contain", `${temp}°C`);
    });
  },
);

// ---- FOTO ----

Then(
  "la imagen del carrusel corresponde con la URL devuelta por Unsplash",
  () => {
    cy.get("@photoData").then((body) => {
      cy.log("Datos de foto:", JSON.stringify(body));
      const imageUrl = body.urls.regular;
      cy.get(".carousel-slide.active")
        .should("have.attr", "style")
        .and("include", imageUrl);
    });
  },
);

// ---- LUGARES ----

Then(
  "el primer restaurante mostrado corresponde con la respuesta de Foursquare",
  () => {
    cy.get("@restaurantData").then((body) => {
      const primerNombre = body.places[0].name;
      cy.contains(".card-title", "Gastronomía 🍽️")
        .closest(".card")
        .find(".lugar-nombre")
        .first()
        .should("contain", primerNombre);
    });
  },
);

Then(
  "el primer lugar de ocio mostrado corresponde con la respuesta de Foursquare",
  () => {
    cy.get("@museumData").then((body) => {
      const primerNombre = body.places[0].name;
      cy.contains(".card-title", "Ocio 🎭")
        .closest(".card")
        .find(".lugar-nombre")
        .first()
        .should("contain", primerNombre);
    });
  },
);

Then(
  "el primer parque mostrado corresponde con la respuesta de Foursquare",
  () => {
    cy.get("@parkData").then((body) => {
      const primerNombre = body.places[0].name;
      cy.contains(".card-title", "Parques 🌿")
        .closest(".card")
        .find(".lugar-nombre")
        .first()
        .should("contain", primerNombre);
    });
  },
);

Then(
  "la primera tienda mostrada corresponde con la respuesta de Foursquare",
  () => {
    cy.get("@shopData").then((body) => {
      const primerNombre = body.places[0].name;
      cy.contains(".card-title", "Compras 🛍️")
        .closest(".card")
        .find(".lugar-nombre")
        .first()
        .should("contain", primerNombre);
    });
  },
);
