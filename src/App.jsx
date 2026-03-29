/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getWeatherByCity } from "./api";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import FavoriteLists from "./components/FavoriteLists";

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
    const trimmedCity = (searchCity || city).trim(); //.trim to remove leading and trailing whitespace

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

      const current = data.current_condition?.[0]; // Get the current condition from the API response
      const nearestArea = data.nearest_area?.[0]; // Get the nearest area information from the API response

      if (!current || !nearestArea) {
        throw new Error("Weather data is unavailable for this city.");
      }

      const weatherData = {
        city: nearestArea?.areaName?.[0]?.value || trimmedCity,
        country: nearestArea?.country?.[0]?.value || "",
        temperature: current?.temp_C || "N/A",
        condition: current?.weatherDesc?.[0]?.value || "N/A",
        humidity: current?.humidity || "N/A",
        windSpeed: current?.windspeedKmph || "N/A",
      };

      console.log(data);

      setWeather(weatherData);
      setCity(weatherData.city); // display the city name by clicking the favorite city button
      setMessage(
        `Weather data loaded for "${weatherData.city}". Check console for details.`,
      );
    } catch (error) {
      setWeather(null);
      setMessage(
        error.message || "Something went wrong while fetching weather data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Enter" key press in the input field to trigger search
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  // Handle adding the current city to favorites
  const handleAddFavorite = () => {
    const cityName = weather.city;

    const alreadyExists = favorites.includes(cityName); //check duplicate city

    if (alreadyExists) {
      setMessage(`${cityName} is already in favorite lists.`);
      return;
    }

    const updatedFavorites = [...favorites, cityName]; //add the new city to the existing favorites list
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setMessage(`${cityName} added to favorite lists.`);
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
