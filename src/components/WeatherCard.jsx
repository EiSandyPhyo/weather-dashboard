/* eslint-disable no-unused-vars */
import React from "react";
import { getWeatherIcon } from "../api";

const WeatherCard = ({ weather, handleAddFavorite }) => {
  return (
    <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-sky-800">
          Weather Information
        </h2>

        <button
          type="button"
          onClick={handleAddFavorite}
          disabled={!weather}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 cursor-pointer disabled:cursor-not-allowed  "
        >
          Add to Favorite
        </button>
      </div>

      {weather ? (
        <div className="space-y-5">
          <div className="rounded-3xl bg-linear-to-r from-sky-500 to-cyan-400 p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">
                  {weather.city}{weather.country ? `, ${weather.country}` : ''}
                </p>

                <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                  {weather.condition}
                </p>

                <p className="mt-4 text-5xl font-bold">
                  {Math.round(weather.temperature)}°
                </p>
              </div>

              <div className="text-6xl">
                {getWeatherIcon(weather.weatherCode)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm font-medium text-sky-700">Humidity</p>
              <p className="mt-2 text-2xl font-bold text-sky-900">
                {weather.humidity}%
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm font-medium text-sky-700">Wind Speed</p>
              <p className="mt-2 text-2xl font-bold text-sky-900">
                {weather.windSpeed} km/h
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No weather data yet. Search for a city.</p>
      )}
    </div>
  );
};

export default WeatherCard;
