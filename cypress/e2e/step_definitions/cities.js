import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const BASE_URL = "http://127.0.0.1:5500/frontend/public/index.html";
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

// ---- BACKGROUND ----

Given("el usuario está en la página de inicio", () => {
  cy.visit(BASE_URL);
});

// ---- WHEN ----

When("el usuario escribe {string} en el buscador", (ciudad) => {
  cy.get("#cityInput").clear().type(ciudad, { delay: 100 });
});

When("hace clic en el botón {string}", (boton) => {
  cy.contains("button", boton).click();
});

When("el usuario hace clic en el botón {string} sin escribir nada", (boton) => {
  cy.contains("button", boton).click();
});

When("el usuario empieza a escribir en el buscador", () => {
  cy.get("#cityInput").type("a");
});

When("aparecen sugerencias de ciudades en el desplegable", () => {
  cy.get("#suggestionsList li", { timeout: 10000 })
    .should("have.length.greaterThan", 0)
    .and("be.visible");
});

When("hace clic en la primera sugerencia", () => {
  cy.get("#suggestionsList li")
    .first()
    .then(($li) => {
      cy.wrap($li.text().split(",")[0].trim()).as("ciudadSugerida");
      cy.wrap($li).click();
    });
});

// ---- THEN ----

Then("es redirigido a la página de ciudad de {string}", (city) => {
  cy.url().should("include", `city.html?city=${city}`);

  cy.get('[data-cy="city-title"]', { timeout: 15000 }).should("be.visible");

  cy.get('[data-cy="city-title"]', { timeout: 15000 }).should(($h1) => {
    const texto = $h1.text().toLowerCase();
    expect(texto).to.not.include("loading");
    expect(texto).to.include(city.toLowerCase());
  });

  cy.get('[data-cy="results-grid"]', { timeout: 10000 })
    .should("be.visible")
    .children()
    .should("have.length.at.least", 1);
});

Then("ve el mensaje {string}", (mensaje) => {
  cy.get("#searchError").should("be.visible").and("contain.text", mensaje);
});

Then("el mensaje de error desaparece", () => {
  cy.get("#searchError").should("not.be.visible");
});

Then("en el desplegable aparecen sugerencias de ciudades", () => {
  cy.get("#suggestionsList li").should("have.length.greaterThan", 0);
});

Then("no aparecen sugerencias en el desplegable", () => {
  cy.get("#suggestionsList li").should("not.exist");
});

Then("es redirigido a la página de ciudad de esa sugerencia", () => {
  cy.get("@ciudadSugerida").then((ciudad) => {
    cy.url().should("include", `city.html?city=${encodeURIComponent(ciudad)}`);
  });
});
