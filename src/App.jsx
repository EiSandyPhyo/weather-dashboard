/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  getWeatherByCity,
  getWeatherByCoords,
  getWeatherCondition,
} from "./api";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import FavoriteLists from "./components/FavoriteLists";
import ForecastSection from "./components/ForecastSection";

function App() {
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteCities")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleSearch = async (searchCity) => {
    const trimmedCity = String(searchCity ?? city).trim(); //.trim to remove leading and trailing whitespace

    setMessage(""); // Clear any previous success messages
    setErrorMsg(""); // Clear any previous error messages
    setWeather(null); // Clear previous weather data

    if (!trimmedCity) {
      setErrorMsg("Please enter a city name");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(`Searching weather for "${trimmedCity}"...`);

      const data = await getWeatherByCity(trimmedCity); //fetch weather data for the specified city
      setErrorMsg(""); // Clear any previous error messages

      const weatherData = {
        city: data.city || trimmedCity,
        country: data.country || "",
        temperature: data.temperature ?? "N/A",
        condition: getWeatherCondition(data.weatherCode) || "N/A",
        humidity: data.humidity ?? "N/A",
        windSpeed: data.windSpeed ?? "N/A",
        weatherCode: data.weatherCode ?? null,
        timezone: data.timezone,
        forecast: data.forecast || [],
      };

      console.log("Weather data:", weatherData);

      setWeather(weatherData);
      setCity(weatherData.city); // display the city name by clicking the favorite city button
      setMessage(`Weather data loaded for "${weatherData.city}".`);
    } catch (error) {
      setWeather(null);
      setMessage(
        error.message || "Something went wrong while fetching weather data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding the current city to favorites
  const handleAddFavorite = () => {
    const cityName = weather.city;

    const alreadyExists = favorites.includes(cityName); //check duplicate city

    if (alreadyExists) {
      setMessage(`${cityName} is already in favorite lists.`);
      setCity("");
      setWeather(null);
      return;
    }

    const updatedFavorites = [...favorites, cityName]; //add the new city to the existing favorites list
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setMessage(`${cityName} added to favorite lists.`);
    setCity("");
    setWeather(null);
  };

  // Handle removing a city from favorites
  const handleRemoveFavorite = (cityToRemove) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${cityToRemove}" from favorite lists?`,
    );

    if (!confirmDelete) {
      return;
    }

    const updatedFavorites = favorites.filter((city) => city !== cityToRemove); //remove only the clicked city from the favorites list

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setMessage(`${cityToRemove} is removed from favorite lists.`);
    setCity("");
    setWeather(null);
  };

  // Handle fetching weather data for the user's current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setMessage("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoords(latitude, longitude);

          const weatherData = {
            city: data.city.replace("City of ", ""), // Remove "City of " prefix if it exists
            country: data.country,
            temperature: data.temperature,
            condition: getWeatherCondition(data.weatherCode),
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            weatherCode: data.weatherCode,
            timezone: data.timezone,
            forecast: data.forecast,
          };
          console.log(weatherData);
          setWeather(weatherData);
          setCity(weatherData.city.replace("City of ", "")); // display the city name by clicking the current location button
          setMessage("Weather data loaded for your current location.");
        } catch (error) {
          setWeather(null);
          setMessage(
            error.message || "Failed to fetch weather for your location.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);

        if (error.code === 1) {
          setMessage("Location permission was denied.");
        } else if (error.code === 2) {
          setMessage("Unable to detect your location.");
        } else if (error.code === 3) {
          setMessage("Location request timed out.");
        } else {
          setMessage("Failed to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Handle "Enter" key press in the input field to trigger search
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch(city);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-sky-100 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-3xl md:text-4xl lg:text-5xl font-bold text-sky-800 capitalize">
            weather dashboard
          </h1>

          <SearchBar
            city={city}
            setCity={setCity}
            handleKeyDown={handleKeyDown}
            handleSearch={handleSearch}
            isLoading={isLoading}
            errorMsg={errorMsg}
            handleUseCurrentLocation={handleUseCurrentLocation}
          />

          {/* <div className="mb-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
            Current input: {city || "Nothing typed yet"}
          </div> */}

          {message && (
            <div className="mb-6 rounded-xl bg-white p-4 text-sm font-medium text-sky-700 shadow-md">
              {message}
            </div>
          )}

          <WeatherCard
            weather={weather}
            handleAddFavorite={handleAddFavorite}
          />

          <ForecastSection forecast={weather?.forecast} weather={weather} />

          <FavoriteLists
            favorites={favorites}
            handleSearch={handleSearch}
            handleRemoveFavorite={handleRemoveFavorite}
          />
        </div>
      </div>
    </>
  );
}

export default App;
