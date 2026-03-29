import React from "react";

const WeatherCard = ({ weather, handleAddFavorite }) => {
  return (
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
              <span className="font-medium">Country:</span> {weather.country}
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
              <span className="font-medium">Humidity:</span> {weather.humidity}%
            </p>
            <p>
              <span className="font-medium">Wind Speed:</span>{" "}
              {weather.windSpeed} km/h
            </p>
            <p>
              <span className="font-medium">Weather Code:</span>{" "}
              {weather.weatherCode}
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
        <p className="text-gray-500">No weather data yet. Search for a city.</p>
      )}
    </div>
  );
};

export default WeatherCard;
