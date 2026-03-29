/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getWeatherByCity } from "./api";
import "./App.css";

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

  const handleSearch = async () => {
    const trimmedCity = city.trim(); //to remove leading and trailing whitespace

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

      setCity(""); // Clear the input field after search
      setWeather(weatherData);
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

    const updatedFavorites = [...favorites, cityName];
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

          <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className={`flex-1 rounded-xl border px-4 py-3 outline-none  ${
                  isLoading
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "border-sky-200 focus:border-sky-500"
                }`}
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoading}
                className={`rounded-xl px-5 py-3 font-medium text-white transition ${
                  isLoading
                    ? "cursor-not-allowed bg-sky-400"
                    : "cursor-pointer bg-sky-600 hover:bg-sky-700"
                }`}
              >
                {isLoading ? "Loading..." : "Search"}
              </button>
            </div>
            <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
          </div>

          {/* <div className="mb-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
            Current input: {city || "Nothing typed yet"}
          </div> */}

          {message && (
            <div className="mb-6 rounded-xl bg-white p-4 text-sm font-medium text-sky-700 shadow-md">
              {message}
            </div>
          )}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-sky-800">
              Weather Information
            </h2>

            {weather ? (
              <>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">City:</span> {weather.city}
                  </p>
                  <p>
                    <span className="font-medium">Country:</span>{" "}
                    {weather.country}
                  </p>
                  <p>
                    <span className="font-medium">Temperature:</span>{" "}
                    {weather.temperature}°C
                  </p>
                  <p>
                    <span className="font-medium">Condition:</span>{" "}
                    {weather.condition}
                  </p>
                  <p>
                    <span className="font-medium">Humidity:</span>{" "}
                    {weather.humidity}%
                  </p>
                  <p>
                    <span className="font-medium">Wind Speed:</span>{" "}
                    {weather.windSpeed} km/h
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFavorite}
                  className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Add to Favorites
                </button>
              </>
            ) : (
              <p className="text-gray-500">
                No weather data yet. Search for a city.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-sky-800 capitalize">
              favorite cities
            </h2>
            {favorites.length > 0 ? (
              <ul className="space-y-2 text-gray-700">
                {favorites.map((favoriteCity, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2"
                  >
                    <span>{favoriteCity}</span>

                    <button
                      onClick={() => handleRemoveFavorite(favoriteCity)}
                      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white cursor-pointer hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No favorite cities yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
