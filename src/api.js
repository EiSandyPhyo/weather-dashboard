/* export async function getWeatherByCity(city) {
  const response = await fetch(`https://wttr.in/${city}?format=j1`)

  if (!response.ok) {
    throw new Error('Failed to fetch weather data.')
  }

  const data = await response.json()
  return data
} */

const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"; //city -> coordinates(lat/long)
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast"; //coordinates(lat/long) -> weather data
const REVERSE_GEOCODING_BASE_URL =
  "https://nominatim.openstreetmap.org/reverse"; //coordinates(lat/long) -> city name

// Function to fetch weather data based on city name - user input
export async function getWeatherByCity(city) {
  const geoResponse = await fetch(
    `${GEOCODING_BASE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  ); //count=1 - the number of search only first result to return

  if (!geoResponse.ok) {
    throw new Error("Failed to search for the city.");
  }

  const geoData = await geoResponse.json(); //API response -> JSON object

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("City not found.");
  }

  const location = geoData.results[0];
  const { latitude, longitude, name, country } = location;

  console.log("Geocoding result from api.js:", location); // Log the geocoding result for debugging

  const weatherResponse = await fetch(
    `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
  );

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const weatherData = await weatherResponse.json();

  return {
    city: name,
    country,
    temperature: weatherData.current?.temperature_2m ?? "N/A",
    humidity: weatherData.current?.relative_humidity_2m ?? "N/A",
    windSpeed: weatherData.current?.wind_speed_10m ?? "N/A",
    weatherCode: weatherData.current?.weather_code ?? null,
  };
}

// Function to fetch weather data based on coordinates - current location - reverse geocoding to get city name
export async function getWeatherByCoords(latitude, longitude) {
  const [weatherResponse, locationResponse] = await Promise.all([
    fetch(
      `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    ),
    fetch(
      `${REVERSE_GEOCODING_BASE_URL}?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    ),
  ]);

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data for your current location.");
  }

  if (!locationResponse.ok) {
    throw new Error("Failed to fetch location name for your current location.");
  }

  const weatherData = await weatherResponse.json();
  const locationData = await locationResponse.json();

  const address = locationData.address || {};

  const cityName =
    address.city ||
    address.town ||
    address.village ||
    address.suburb ||
    address.county ||
    "Unknown location";

  const countryName = address.country || "";

  console.log(JSON.stringify(locationData, null, 2));

  return {
    city: cityName,
    country: countryName,
    temperature: weatherData.current?.temperature_2m ?? "N/A",
    humidity: weatherData.current?.relative_humidity_2m ?? "N/A",
    windSpeed: weatherData.current?.wind_speed_10m ?? "N/A",
    weatherCode: weatherData.current?.weather_code ?? null,
  };
}

export function getWeatherCondition(weatherCode) {
  const weatherMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherMap[weatherCode] || "Unknown condition";
}

// function to get a weather icon based on the weather code //Weather variable documentation
export function getWeatherIcon(weatherCode) {
  if (weatherCode === 0) return "☀️";
  if ([1, 2].includes(weatherCode)) return "🌤️";
  if (weatherCode === 3) return "☁️";
  if ([45, 48].includes(weatherCode)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "❄️";
  if ([95, 96, 99].includes(weatherCode)) return "⛈️";

  return "🌍";
}
