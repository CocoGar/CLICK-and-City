# CLICK&City 🌆

Plataforma web de guía urbana digital que permite consultar información relevante de cualquier ciudad: clima, restaurantes, ocio, parques y zonas comerciales.

Proyecto Fin de Ciclo — DAW · Fomento Ocupacional FOC

---

## Equipo

| Nombre | Tarea principal |
|--------|----------------|
| María del Carmen García Rayo | Gestora del proyecto |
| Sergio Calvo Aguilar | Desarrollo frontend |
| Helena Cristina Muñoz González | Planificación y calidad |
| Joan Clarí López | Documentación y diseño |
| Pablo Goya Garrido | Presupuesto y backend |

---

## Tecnologías utilizadas

**Frontend**
- HTML, CSS, JavaScript
- [Leaflet.js](https://leafletjs.com/) — librería de mapas interactivos
- [OpenStreetMap](https://www.openstreetmap.org/) — proveedor de mapas gratuito y sin límites

**Backend**
- Node.js + Express

**Infraestructura**
- Docker + Docker Compose
- Git + GitHub

---

## APIs externas

| API | Uso | Plan | Límite gratuito |
|-----|-----|------|-----------------|
| [OpenWeatherMap](https://openweathermap.org/api) | Clima actual de la ciudad | Free | 1.000 llamadas/día |
| [Foursquare Places](https://foursquare.com/developers) | Restaurantes, ocio y parques | Free | 950 llamadas/día |
| [Unsplash](https://unsplash.com/developers) | Fotos representativas de ciudades | Free | 50 llamadas/hora |
| [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) | Autocompletar búsqueda de ciudades | Basic (RapidAPI) | 1.000 llamadas/día |

---

## Variables de entorno

Crea un archivo `.env` dentro de la carpeta `backend/` con las siguientes claves:

```
OPENWEATHER_API_KEY=tu_key_aqui
FOURSQUARE_API_KEY=tu_key_aqui
UNSPLASH_ACCESS_KEY=tu_key_aqui
RAPIDAPI_KEY=tu_key_aqui
```

> ⚠️ **El archivo `.env` nunca debe subirse a GitHub.** Está incluido en `.gitignore`. Comparte las keys con el equipo por un canal privado (WhatsApp, etc.).

---

## Estructura del proyecto

```
click-and-city/
├── backend/
│   ├── src/
│   │   ├── rutas/
│   │   │   ├── clima.js
│   │   │   ├── lugares.js
│   │   │   └── ciudades.js
│   │   ├── controladores/
│   │   │   ├── controladorClima.js
│   │   │   ├── controladorLugares.js
│   │   │   └── controladorCiudades.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── city.html
│   ├── category.html
│   ├── css/
│   │   ├── main.css
│   │   ├── home.css
│   │   └── city.css
│   └── js/
│       ├── api.js
│       ├── home.js
│       ├── city.js
│       └── category.js
├── docker-compose.yml
└── README.md
```

---

## Endpoints del backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/weather/:city` | Clima actual de la ciudad |
| GET | `/api/places/:city/:category` | Lugares por ciudad y categoría |
| GET | `/api/cities/search?q=...` | Sugerencias de ciudades para autocompletar |
| GET | `/api/photo/:city` | Foto representativa de la ciudad |

---

## Instalación y puesta en marcha

### Requisitos
- [Docker](https://www.docker.com/) instalado en tu máquina

### Pasos

1. Clona el repositorio:
```bash
git clone https://github.com/CocoGar/CLICK-and-City.git
cd CLICK-and-City
```

2. Crea el archivo `.env` en `backend/` con las keys (ver sección anterior)

3. Levanta el proyecto con Docker:
```bash
docker-compose up
```

4. Accede en el navegador:
   - Frontend: http://localhost:8080
   - Backend: http://localhost:3000

---

## Planificación

| Semana | Objetivo |
|--------|----------|
| Semana 1 | Setup, estructura del proyecto y obtención de API keys |
| Semana 2 | Backend funcional con todos los endpoints |
| Semana 3 | Frontend conectado al backend |
| Semana 4 | Diseño, pruebas y despliegue |

---

## Estado del proyecto

🚧 En desarrollo — Semana 1: Setup inicial completado, backend con Express configurado, rutas vacías añadidas para categorías y ciudades, .env conectado. Próximos pasos: crear estructura de rutas y controladores según la documentación.
