# CLICK&City

Plataforma web de guía urbana digital que permite consultar información relevante de cualquier ciudad: clima, restaurantes, ocio, parques y zonas comerciales.

**Proyecto Fin de Ciclo — DAW · Fomento Ocupacional FOC**

## Equipo

| Nombre                         |
| ------------------------------ |
| María del Carmen García Rayo   |
| Sergio Calvo Aguilar           |
| Helena Cristina Muñoz González |
| Joan Clarí López               |
| Pablo Goya Garrido             |

## Tecnologías utilizadas

**Frontend**

- HTML, CSS, JavaScript

**Backend**

- Node.js + Express

**Testing**

- Cypress + Cucumber/Gherkin (tests E2E automatizados)

**Infraestructura**

- Docker + Docker Compose
- Git + GitHub

## APIs externas

| API                                                                   | Uso                                   | Plan             | Límite gratuito    |
| --------------------------------------------------------------------- | ------------------------------------- | ---------------- | ------------------ |
| [OpenWeatherMap](https://openweathermap.org/api)                      | Clima actual y previsión 5 días       | Free             | 1.000 llamadas/día |
| [Foursquare Places](https://foursquare.com/developers)                | Restaurantes, ocio, parques y tiendas | Free             | 950 llamadas/día   |
| [Unsplash](https://unsplash.com/developers)                           | Fotos representativas de ciudades     | Free             | 50 llamadas/hora   |
| [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) | Autocompletar búsqueda de ciudades    | Basic (RapidAPI) | 1.000 llamadas/día |

## Variables de entorno

**Nota:** El archivo `.env` se incluye excepcionalmente en este repositorio para facilitar la evaluación del proyecto.
En condiciones normales este archivo está excluido del repositorio mediante `.gitignore` y las API keys se comparten entre los miembros del equipo por un canal privado, nunca a través de GitHub.

## Estructura del proyecto

CLICK-AND-CITY/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── citiesController.js
│ │ │ ├── photoController.js
│ │ │ ├── placesController.js
│ │ │ └── weatherController.js
│ │ ├── routes/
│ │ │ ├── cities.js
│ │ │ ├── photo.js
│ │ │ ├── places.js
│ │ │ └── weather.js
│ │ └── app.js
│ ├── .env
│ ├── Dockerfile
│ └── package.json
├── frontend/
│ ├── public/
│ │ ├── css/
│ │ ├── js/
│ │ ├── category.html
│ │ ├── city.html
│ │ ├── fondo.jpg
│ │ └── index.html
│ ├── Dockerfile
│ └── nginx.conf
├── cypress/
├── cypress.config.js
├── docker-compose.yml
└── README.md

## Endpoints del backend

| Método | Endpoint                              | Descripción                                |
| ------ | ------------------------------------- | ------------------------------------------ |
| GET    | `/api/weather?city={ciudad}`          | Clima actual de la ciudad                  |
| GET    | `/api/weather/forecast?city={ciudad}` | Previsión del tiempo 5 días                |
| GET    | `/api/places/{ciudad}/{categoria}`    | Lugares por ciudad y categoría             |
| GET    | `/api/photo/{ciudad}`                 | Foto representativa de la ciudad           |
| GET    | `/api/cities/search?q={texto}`        | Sugerencias de ciudades para autocompletar |

**Categorías disponibles para `/api/places`:**

`restaurant` · `bar` · `cafe` · `museum` · `park` · `shop` · `hotel` · `nightclub`

## Cómo cargar el proyecto

### Opción A — Con Docker

**Requisitos:** [Docker Desktop](https://www.docker.com/) instalado y en ejecución.

1. Descomprime el archivo ZIP del proyecto

2. Abre una terminal en la carpeta raíz del proyecto

3. Levanta el proyecto:
   docker-compose up --build

4. Accede en el navegador:
   - Frontend: http://localhost:8080
   - Backend: http://localhost:3000

### Opción B — Sin Docker

**Requisitos:** [Node.js](https://nodejs.org/) instalado.

1. Descomprime el archivo ZIP del proyecto

2. Instala las dependencias del backend:
   cd backend
   npm install

3. Arranca el backend:
   node src/app.js

4. Abre `frontend/public/index.html` con Live Server desde VSCode o directamente en el navegador.

## Tests E2E

El proyecto incluye tests automatizados con Cypress + Cucumber. Para ejecutarlos:

# Desde la raíz del proyecto

npm install
npx cypress open

**NOTA**: El backend debe estar en ejecución antes de lanzar los tests.
