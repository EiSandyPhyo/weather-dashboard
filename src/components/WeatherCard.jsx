/* eslint-disable no-unused-vars */
import React from "react";
import { getWeatherIcon } from "../api";

const WeatherCard = ({ weather, handleAddFavorite }) => {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-sky-800">
        Weather Information
      </h2>

      {weather ? (
        <>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center justify-between rounded-2xl bg-sky-50 p-4">
              
              <div>
                <p className="text-lg font-semibold text-sky-800">
                  {weather.city}, {weather.country}
                </p>
                <p className="mt-1 inline-block rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  {weather.condition}
                </p>
              </div>

              <div className="text-5xl">
                {getWeatherIcon(weather.weatherCode)}
              </div>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-medium">Temperature:</span>{" "}
                {weather.temperature}°C
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
          </div>
          <button
            type="button"
            onClick={handleAddFavorite}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 cursor-pointer"
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
