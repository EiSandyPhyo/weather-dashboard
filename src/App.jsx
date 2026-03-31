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
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteCities")) || [];
    setFavorites(savedFavorites);
  }, []);

  // Get scroll offset based on screen size
  const getScrollOffset = () => {
    let scrollTop = 0;

    if (window.innerWidth < 640) {
      scrollTop = 20; // mobile
    } else if (window.innerWidth < 1024) {
      scrollTop = 0; // tablet
    } else {
      scrollTop = 100; // desktop
    }

    return scrollTop;
  };

  const handleSearch = async (searchCity, shouldScrollToTop = false) => {
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
      setMessageType("loaded");

      if (shouldScrollToTop) {
        setTimeout(() => {
          window.scrollTo({
            top: getScrollOffset(),
            behavior: "smooth",
          });
        }, 100);
      } //scroll to top of the page after clicking the favorite city button
    } catch (error) {
      setWeather(null);
      setMessage(
        error.message || "Something went wrong while fetching weather data.",
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding the current city to favorites
  const handleAddFavorite = () => {
    const cityName = weather.city;

    const alreadyExists = favorites.includes(cityName); //check duplicate city

    if (alreadyExists) {
      setMessage(`"${cityName}" is already in favorite lists.`);
      setMessageType("duplicate");
      setCity("");
      setWeather(null);
      return;
    }

    const updatedFavorites = [...favorites, cityName]; //add the new city to the existing favorites list
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setMessage(`"${cityName}" is added to favorite lists.`);
    setMessageType("success");
    setCity("");
    setWeather(null);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
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
    setMessage(`"${cityToRemove}" is removed from favorite lists.`);
    setMessageType("delete");
    setCity("");
    setWeather(null);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  // Handle fetching weather data for the user's current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      setMessageType("info");
      return;
    }

    setIsLoading(true);
    setMessage("Getting your current location...");
    setMessageType("info");

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
          setMessageType("loaded");
        } catch (error) {
          setWeather(null);
          setMessage(
            error.message || "Failed to fetch weather for your location.",
          );
          setMessageType("error");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);

        if (error.code === 1) {
          setMessage("Location permission was denied.");
          setMessageType("error");
        } else if (error.code === 2) {
          setMessage("Unable to detect your location.");
          setMessageType("error");
        } else if (error.code === 3) {
          setMessage("Location request timed out.");
          setMessageType("error");
        } else {
          setMessage("Failed to get your location.");
          setMessageType("error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Determine theme based on timezone for dynamic styling
  const getThemeByTimezone = (timezone) => {
    if (!timezone) return "day";

    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        hour12: false,
        timeZone: timezone,
      }).format(new Date()),
    );

    console.log("what time is it?  " + hour + "  in " + timezone);

    if (hour >= 6 && hour < 18) {
      return "day";
    }

    return "night";
  };

  // Handle "Enter" key press in the input field to trigger search
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch(city);
    }
  };

  const currentTheme = getThemeByTimezone(weather?.timezone);
  console.log("this is from app.jsx --- " + currentTheme);

  const getMessageConfig = () => {
    if (messageType === "success") {
      return {
        bg: currentTheme === "day" ? "bg-green-50" : "bg-green-900/30",
        text: currentTheme === "day" ? "text-green-700" : "text-green-200",
        border: "border-l-4 border-green-500",
        icon: "✅",
        title: "Success",
      };
    }

    if (messageType === "loaded") {
      return {
        bg: currentTheme === "day" ? "bg-green-50" : "bg-green-900/30",
        text: currentTheme === "day" ? "text-green-700" : "text-green-200",
        border: "border-l-4 border-green-500",
        icon: "✔️",
        title: "Loaded",
      };
    }

    if (messageType === "error") {
      return {
        bg: currentTheme === "day" ? "bg-yellow-50" : "bg-yellow-900/30",
        text: currentTheme === "day" ? "text-yellow-700" : "text-yellow-200",
        border: "border-l-4 border-yellow-500",
        icon: "⚠️",
        title: "Error",
      };
    }

    if (messageType === "delete") {
      return {
        bg: currentTheme === "day" ? "bg-red-50" : "bg-red-900/30",
        text: currentTheme === "day" ? "text-red-700" : "text-red-200",
        border: "border-l-4 border-red-500",
        icon: "❌",
        title: "Removed",
      };
    }

    if (messageType === "duplicate") {
      return {
        bg: currentTheme === "day" ? "bg-red-50" : "bg-red-900/30",
        text: currentTheme === "day" ? "text-red-700" : "text-red-200",
        border: "border-l-4 border-red-500",
        icon: "🚫",
        title: "Duplicate",
      };
    }

    return {
      bg: currentTheme === "day" ? "bg-blue-50" : "bg-slate-800",
      text: currentTheme === "day" ? "text-blue-700" : "text-white",
      border: "border-l-4 border-blue-500",
      icon: "ℹ️",
      title: "Info",
    };
  };

  return (
    <>
      <div
        className={`min-h-screen px-4 py-10 transition-colors duration-500 ${currentTheme === "day" ? "bg-sky-100" : "bg-slate-900 text-white"}`}
      >
        <div className="mx-auto max-w-2xl">
          <h1
            className={`mb-8 text-center text-3xl md:text-4xl lg:text-5xl font-bold text-sky-800 capitalize ${currentTheme === "day" ? "text-sky-800" : " text-white"}`}
          >
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
            currentTheme={currentTheme}
          />

          {message &&
            (() => {
              const config = getMessageConfig();

              return (
                <div
                  className={`mb-6 flex items-center gap-3 rounded-xl p-4 shadow-md ${config.bg} ${config.text} ${config.border}`}
                >
                  <p className="text-xl">{config.icon}</p>
                  <p className="text-sm opacity-80">{message}</p>
                </div>
              );
            })()}

          <WeatherCard
            weather={weather}
            handleAddFavorite={handleAddFavorite}
            currentTheme={currentTheme}
          />

          <ForecastSection
            forecast={weather?.forecast}
            weather={weather}
            currentTheme={currentTheme}
          />

          <FavoriteLists
            favorites={favorites}
            handleSearch={handleSearch}
            handleRemoveFavorite={handleRemoveFavorite}
            currentTheme={currentTheme}
          />
        </div>
      </div>
    </>
  );
}

export default App;
