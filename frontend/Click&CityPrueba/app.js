// API Configuration
const API_CONFIG = {
  nominatim: 'https://nominatim.openstreetmap.org/search',
  wikipedia: 'https://en.wikipedia.org/w/api.php',
  wikimedia: 'https://commons.wikimedia.org/w/api.php',
  openMeteo: 'https://api.open-meteo.com/v1/forecast',
  restCountries: 'https://restcountries.com/v3.1/name/',
  overpass: 'https://overpass-api.de/api/interpreter'
};

// Cache for API responses (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// DOM Elements
const homePage = document.getElementById('homePage');
const cityView = document.getElementById('cityView');
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const backBtn = document.getElementById('backBtn');
const cityImage = document.getElementById('cityImage');
const cityName = document.getElementById('cityName');
const cityCountry = document.getElementById('cityCountry');
const infoBlocks = document.getElementById('infoBlocks');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const dismissError = document.getElementById('dismissError');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
backBtn.addEventListener('click', showHomePage);
dismissError.addEventListener('click', hideError);

// Utility Functions
function showLoading() {
  loadingSpinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  loadingSpinner.classList.add('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

function setCachedData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('Failed to cache data:', e);
  }
}

// API Functions
async function searchCityCoordinates(cityName) {
  console.log('🔍 Searching for city:', cityName);
  const cacheKey = `coords_${cityName.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('✅ Found cached coordinates:', cached);
    return cached;
  }

  const url = `${API_CONFIG.nominatim}?q=${encodeURIComponent(cityName)}&format=json&limit=1&addressdetails=1`;
  console.log('📡 Fetching from Nominatim:', url);

  try {
    const response = await fetch(url);
    console.log('📥 Nominatim response status:', response.status);

    if (!response.ok) {
      console.error('❌ Nominatim API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch city coordinates: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Nominatim data:', data);

    if (!data || data.length === 0) {
      console.warn('⚠️ No results found for:', cityName);
      return null;
    }

    const result = {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name,
      city: data[0].address?.city || data[0].address?.town || data[0].address?.village || cityName,
      country: data[0].address?.country || 'Unknown'
    };

    console.log('✅ City coordinates found:', result);
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('❌ Error in searchCityCoordinates:', error);
    throw error;
  }
}

async function getWeatherData(lat, lon) {
  console.log('🌤️ Fetching weather for coordinates:', lat, lon);
  const cacheKey = `weather_${lat}_${lon}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('✅ Found cached weather:', cached);
    return cached;
  }

  const url = `${API_CONFIG.openMeteo}?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`;
  console.log('📡 Fetching from Open-Meteo:', url);

  try {
    const response = await fetch(url);
    console.log('📥 Weather response status:', response.status);

    if (!response.ok) throw new Error('Failed to fetch weather data');

    const data = await response.json();
    console.log('📦 Weather data:', data);
    const weather = data.current_weather;

    const result = {
      temperature: Math.round(weather.temperature),
      windSpeed: Math.round(weather.windspeed),
      weatherCode: weather.weathercode,
      description: getWeatherDescription(weather.weathercode)
    };

    console.log('✅ Weather data processed:', result);
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('❌ Error in getWeatherData:', error);
    throw error;
  }
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso'
  };
  return weatherCodes[code] || 'Condiciones variables';
}

async function getCityInfo(cityName) {
  console.log('📚 Fetching Wikipedia info for:', cityName);
  const cacheKey = `wiki_${cityName.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('✅ Found cached Wikipedia data');
    return cached;
  }

  const url = `${API_CONFIG.wikipedia}?action=query&format=json&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original&titles=${encodeURIComponent(cityName)}&origin=*`;
  console.log('📡 Fetching from Wikipedia:', url);

  try {
    const response = await fetch(url);
    console.log('📥 Wikipedia response status:', response.status);

    if (!response.ok) throw new Error('Failed to fetch city info');

    const data = await response.json();
    console.log('📦 Wikipedia data:', data);
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId === '-1') {
      console.warn('⚠️ No Wikipedia page found for:', cityName);
      return null;
    }

    const page = pages[pageId];
    const result = {
      extract: page.extract || '',
      image: page.original?.source || null
    };

    console.log('✅ Wikipedia data processed');
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('❌ Error in getCityInfo:', error);
    throw error;
  }
}

async function getCityImage(cityName) {
  console.log('🖼️ Fetching image for:', cityName);
  try {
    const url = `${API_CONFIG.wikimedia}?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(cityName + ' skyline city')}&gsrlimit=1&prop=imageinfo&iiprop=url&origin=*`;
    console.log('📡 Fetching from Wikimedia:', url);

    const response = await fetch(url);
    console.log('📥 Wikimedia response status:', response.status);
    if (!response.ok) {
      console.warn('⚠️ Wikimedia API response not OK:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('📦 Wikimedia data:', data);
    if (!data.query || !data.query.pages) {
      console.warn('⚠️ No query or pages in Wikimedia data for:', cityName);
      return null;
    }

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const imageUrl = pages[pageId]?.imageinfo?.[0]?.url;

    if (imageUrl) {
      console.log('✅ Image URL found:', imageUrl);
    } else {
      console.warn('⚠️ No image found for:', cityName);
    }
    return imageUrl || null;
  } catch (e) {
    console.error('❌ Error in getCityImage:', e);
    return null;
  }
}

// Overpass API Functions for Real POI Data
async function getPOIData(lat, lon, cityName) {
  console.log('🗺️ Fetching real POI data for:', cityName, 'at', lat, lon);

  const cacheKey = `poi_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('✅ Found cached POI data');
    return cached;
  }

  try {
    // Fetch all POI categories in parallel
    const [restaurants, culture, shopping, parks] = await Promise.all([
      fetchOverpassPOIs(lat, lon, 'restaurants', 2000, 10),
      fetchOverpassPOIs(lat, lon, 'culture', 3000, 10),
      fetchOverpassPOIs(lat, lon, 'shopping', 2000, 8),
      fetchOverpassPOIs(lat, lon, 'parks', 3000, 10)
    ]);

    const result = {
      restaurants: restaurants || [],
      culture: culture || [],
      shopping: shopping || [],
      parks: parks || []
    };

    console.log('📊 POI data fetched:', {
      restaurants: result.restaurants.length,
      culture: result.culture.length,
      shopping: result.shopping.length,
      parks: result.parks.length
    });

    // Cache for 7 days (POI data doesn't change frequently)
    const CACHE_DURATION_7_DAYS = 7 * 24 * 60 * 60 * 1000;
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to cache POI data:', e);
    }

    return result;
  } catch (error) {
    console.error('❌ Error fetching POI data:', error);
    return {
      restaurants: [],
      culture: [],
      shopping: [],
      parks: []
    };
  }
}

async function fetchOverpassPOIs(lat, lon, category, radius, limit) {
  console.log(`🔍 Fetching ${category} within ${radius}m`);

  const query = buildOverpassQuery(lat, lon, category, radius, limit);

  try {
    const response = await fetch(API_CONFIG.overpass, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log(`📥 Overpass ${category} response status:`, response.status);

    if (!response.ok) {
      console.warn(`⚠️ Overpass API error for ${category}:`, response.status);
      return [];
    }

    const data = await response.json();
    const pois = parsePOIResults(data, category);

    console.log(`✅ Found ${pois.length} ${category} POIs`);
    return pois;
  } catch (error) {
    console.error(`❌ Error fetching ${category} POIs:`, error);
    return [];
  }
}

function buildOverpassQuery(lat, lon, category, radius, limit) {
  let tags = '';

  switch (category) {
    case 'restaurants':
      tags = '["amenity"~"restaurant|cafe|bar|fast_food"]';
      break;
    case 'culture':
      tags = '["tourism"~"museum|attraction|gallery|theatre"]';
      break;
    case 'shopping':
      tags = '["shop"~"mall|department_store|supermarket"]["name"]';
      break;
    case 'parks':
      tags = '["leisure"~"park|garden"]["name"]';
      break;
    default:
      tags = '["name"]';
  }

  // Overpass QL query
  return `[out:json][timeout:25];
(
  node${tags}(around:${radius},${lat},${lon});
  way${tags}(around:${radius},${lat},${lon});
);
out body ${limit};`;
}

function parsePOIResults(data, category) {
  if (!data || !data.elements || data.elements.length === 0) {
    return [];
  }

  const pois = data.elements
    .filter(element => element.tags && element.tags.name)
    .map(element => ({
      name: element.tags.name,
      type: element.tags.amenity || element.tags.tourism || element.tags.shop || element.tags.leisure || category
    }))
    .filter((poi, index, self) =>
      // Remove duplicates by name
      index === self.findIndex(p => p.name === poi.name)
    )
    .slice(0, 8); // Limit to 8 items per category

  return pois;
}

// Generate City Information Blocks
function generateCityBlocks(cityData, weatherData, wikiData, poiData = null) {
  console.log('🔨 Generating blocks with data:', { cityData, weatherData, hasWikiData: !!wikiData, hasPOIData: !!poiData });
  const blocks = [];

  // Weather Block
  blocks.push({
    icon: '☀️',
    title: 'Clima básico',
    content: `${weatherData.description} con una temperatura de ${weatherData.temperature}°C. Viento a ${weatherData.windSpeed} km/h. Información actualizada en tiempo real desde ${cityData.city}, ${cityData.country}.`
  });

  // Extract information from Wikipedia
  const extract = wikiData?.extract || '';
  console.log('📝 Wikipedia extract length:', extract.length);

  // Restaurants/Food Block - Use REAL POI data
  const hasRealRestaurants = poiData && poiData.restaurants && poiData.restaurants.length > 0;

  if (hasRealRestaurants) {
    console.log('🍽️ Using real restaurant data:', poiData.restaurants.length, 'restaurants');
    blocks.push({
      icon: '🍽️',
      title: 'Dónde comer',
      items: poiData.restaurants.slice(0, 8).map(poi => poi.name)
    });
  } else {
    console.log('🍽️ Using fallback restaurant data');
    const foodKeywords = ['restaurant', 'cuisine', 'food', 'dining', 'gastronomy', 'culinary', 'cocina', 'gastronomía'];
    const hasFood = foodKeywords.some(kw => extract.toLowerCase().includes(kw));

    blocks.push({
      icon: '🍽️',
      title: 'Dónde comer',
      items: hasFood
        ? [
          'Restaurantes del centro histórico',
          'Mercados tradicionales locales',
          'Gastronomía típica regional',
          'Cafeterías y bares locales'
        ]
        : [
          `Descubre la cocina tradicional de ${cityData.country}`,
          'Restaurantes en el centro de la ciudad',
          'Mercados locales con productos frescos',
          'Cafeterías y terrazas con encanto'
        ]
    });
  }

  // Culture Block - Use REAL POI data
  const hasRealCulture = poiData && poiData.culture && poiData.culture.length > 0;

  if (hasRealCulture) {
    console.log('🎭 Using real culture data:', poiData.culture.length, 'attractions');
    blocks.push({
      icon: '🎭',
      title: 'Ocio y cultura',
      items: poiData.culture.slice(0, 8).map(poi => poi.name)
    });
  } else {
    console.log('🎭 Using fallback culture data');
    const cultureKeywords = ['museum', 'cathedral', 'church', 'palace', 'castle', 'monument', 'teatro', 'museo', 'catedral'];
    const cultureSites = [];

    if (extract) {
      const sentences = extract.split('.');
      sentences.forEach(sentence => {
        cultureKeywords.forEach(keyword => {
          if (sentence.toLowerCase().includes(keyword) && cultureSites.length < 4) {
            const trimmed = sentence.trim();
            if (trimmed.length > 10 && trimmed.length < 150) {
              cultureSites.push(trimmed);
            }
          }
        });
      });
    }

    blocks.push({
      icon: '🎭',
      title: 'Ocio y cultura',
      items: cultureSites.length > 0
        ? cultureSites.slice(0, 4)
        : [
          `Explora el patrimonio histórico de ${cityData.city}`,
          'Museos y galerías de arte',
          'Monumentos y edificios emblemáticos',
          'Tours culturales y visitas guiadas'
        ]
    });
  }

  // Shopping Block - Use REAL POI data
  const hasRealShopping = poiData && poiData.shopping && poiData.shopping.length > 0;

  if (hasRealShopping) {
    console.log('🛍️ Using real shopping data:', poiData.shopping.length, 'places');
    blocks.push({
      icon: '🛍️',
      title: 'Compras',
      items: poiData.shopping.slice(0, 8).map(poi => poi.name)
    });
  } else {
    console.log('🛍️ Using fallback shopping data');
    blocks.push({
      icon: '🛍️',
      title: 'Compras',
      items: [
        'Zona comercial del centro',
        'Mercados locales y artesanía',
        'Tiendas de souvenirs y recuerdos',
        'Centros comerciales modernos'
      ]
    });
  }

  // Parks Block - Use REAL POI data
  const hasRealParks = poiData && poiData.parks && poiData.parks.length > 0;

  if (hasRealParks) {
    console.log('🌳 Using real parks data:', poiData.parks.length, 'parks');
    blocks.push({
      icon: '🌳',
      title: 'Parques y zonas verdes',
      items: poiData.parks.slice(0, 8).map(poi => poi.name)
    });
  } else {
    console.log('🌳 Using fallback parks data');
    const parkKeywords = ['park', 'garden', 'green', 'parque', 'jardín'];
    const hasParks = parkKeywords.some(kw => extract.toLowerCase().includes(kw));

    blocks.push({
      icon: '🌳',
      title: 'Parques y zonas verdes',
      items: hasParks
        ? [
          'Parques urbanos y jardines',
          'Zonas verdes para pasear',
          'Áreas recreativas',
          'Espacios naturales cercanos'
        ]
        : [
          'Parques y jardines de la ciudad',
          'Zonas verdes para relajarse',
          'Paseos y áreas peatonales',
          'Miradores y espacios al aire libre'
        ]
    });
  }

  // Events Block - Generic (no free real-time events API)
  blocks.push({
    icon: '🎉',
    title: 'Eventos destacados',
    items: [
      'Festivales culturales y tradicionales',
      'Eventos deportivos locales',
      'Conciertos y espectáculos',
      'Celebraciones y fiestas populares'
    ]
  });

  console.log('✅ Generated', blocks.length, 'blocks successfully');
  return blocks;
}

// Main Search Handler
async function handleSearch(e) {
  e.preventDefault();

  const searchTerm = cityInput.value.trim();
  if (!searchTerm) return;

  console.log('🚀 Starting search for:', searchTerm);
  hideError();
  showLoading();

  try {
    // Step 1: Get city coordinates
    console.log('📍 Step 1: Getting city coordinates...');
    const cityData = await searchCityCoordinates(searchTerm);
    if (!cityData) {
      console.warn('⚠️ City not found');
      showError(`No se encontró la ciudad "${searchTerm}". Verifica el nombre e intenta de nuevo.`);
      return;
    }

    console.log('📍 City data:', cityData);

    // Step 2: Fetch all data in parallel (including POI data)
    console.log('📡 Step 2: Fetching additional data in parallel...');
    const [weatherData, wikiData, imageUrl, poiData] = await Promise.all([
      getWeatherData(cityData.lat, cityData.lon).catch((err) => {
        console.warn('⚠️ Weather API failed, using fallback:', err);
        return {
          temperature: 20,
          windSpeed: 10,
          weatherCode: 0,
          description: 'Condiciones agradables'
        };
      }),
      getCityInfo(cityData.city).catch((err) => {
        console.warn('⚠️ Wikipedia API failed:', err);
        return null;
      }),
      getCityImage(cityData.city).catch((err) => {
        console.warn('⚠️ Image API failed:', err);
        return null;
      }),
      getPOIData(cityData.lat, cityData.lon, cityData.city).catch((err) => {
        console.warn('⚠️ POI API failed, using fallback:', err);
        return null;
      })
    ]);

    console.log('📊 All data fetched:', { weatherData, wikiData, imageUrl, poiData });

    // Step 3: Generate blocks with POI data
    console.log('🔨 Step 3: Generating info blocks...');
    const blocks = generateCityBlocks(cityData, weatherData, wikiData, poiData);
    console.log('✅ Generated', blocks.length, 'blocks');

    // Step 4: Display city view
    console.log('🎨 Step 4: Displaying city view...');
    hideLoading();

    // Better image fallback with gradient placeholder
    const fallbackImage = `https://via.placeholder.com/1200x400/667eea/ffffff?text=${encodeURIComponent(cityData.city)}`;
    const finalImage = imageUrl || wikiData?.image || fallbackImage;

    console.log('🖼️ Using image:', finalImage);

    displayCityView({
      name: cityData.city,
      country: cityData.country,
      image: finalImage,
      blocks
    });

    console.log('✅ Search completed successfully!');

  } catch (error) {
    console.error('❌ Search error:', error);
    console.error('❌ Error stack:', error.stack);
    showError(`Ocurrió un error al buscar la ciudad: ${error.message}. Por favor, verifica tu conexión a internet e intenta de nuevo.`);
  }
}

// Display City View
function displayCityView(city) {
  // Update city header
  cityImage.src = city.image;
  cityImage.alt = city.name;
  cityName.textContent = city.name;
  cityCountry.textContent = city.country;

  // Clear previous blocks
  infoBlocks.innerHTML = '';

  // Create info blocks
  city.blocks.forEach((block, index) => {
    const blockEl = document.createElement('div');
    blockEl.className = 'info-block';
    blockEl.style.animationDelay = `${index * 0.1}s`;

    let contentHTML = '';
    if (block.content) {
      contentHTML = `<p class="block-content">${block.content}</p>`;
    } else if (block.items) {
      contentHTML = `
        <ul class="block-list">
          ${block.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }

    blockEl.innerHTML = `
      <span class="block-icon">${block.icon}</span>
      <h3 class="block-title">${block.title}</h3>
      ${contentHTML}
    `;

    infoBlocks.appendChild(blockEl);
  });

  // Switch views
  homePage.classList.add('hidden');
  cityView.classList.remove('hidden');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show Home Page
function showHomePage() {
  cityView.classList.add('hidden');
  homePage.classList.remove('hidden');
  cityInput.value = '';
  cityInput.focus();
  hideError();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Focus input on load
window.addEventListener('load', () => {
  cityInput.focus();
});
