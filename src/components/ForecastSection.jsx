/* eslint-disable no-unused-vars */
import React from "react";
import { getWeatherCondition, getWeatherIcon } from "../api";
import CityClock from "./CityClock";
import calendarIcon from "../assets/calendar_dark.png";
import calendarIcon2 from "../assets/calendar_white.png";

const ForecastSection = ({ forecast, weather, currentTheme }) => {
  const formatDay = (dateString, index) => {
    if (index === 0) return "Today";

    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "short",
    });
  };

  if (!forecast || forecast.length === 0) {
    return null;
  }
  return (
    <>
      {/* <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-sky-800">
        5-Day Forecast
      </h2>
      <p>Updated: {forecast[0].date}</p>
      <CityClock timezone={weather?.timezone} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className="rounded-2xl bg-sky-50 p-4 text-center"
          >
            <p className="text-sm font-medium text-sky-700">
              {formatDay(day.date, index)}
            </p>

            <div className="my-3 text-4xl">
              {getWeatherIcon(day.weatherCode)}
            </div>

            <p className="text-sm text-gray-600 h-7">
              {getWeatherCondition(day.weatherCode)}
            </p>

            <p className="mt-3 text-lg font-bold text-sky-900">
              {Math.round(day.maxTemp)}°C
            </p>

            <p className="text-sm text-gray-500">
              Min: {Math.round(day.minTemp)}°C
            </p>
          </div>
        ))}
      </div>
    </div> */}

      <div
        className={`my-6 rounded-3xl p-6 shadow-lg transition-colors duration-500 ${
          currentTheme === "day"
            ? "bg-linear-to-br from-sky-100 to-blue-200"
            : "bg-linear-to-br from-slate-800 to-indigo-950"
        }`}
      >
        {/* Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-2">
            <img
              src={currentTheme === "day" ? calendarIcon : calendarIcon2}
              alt="Calendar"
              className="inline-block w-5 h-5 "
            />

            <h2
              className={`text-2xl font-bold ${currentTheme === "day" ? "text-sky-900" : "text-white"}`}
            >
              5-Day Forecast
            </h2>
          </div>

          <div className="">
            <span
              className={`text-sm ${currentTheme === "day" ? "text-gray-600" : "text-slate-300"}`}
            >
              Updated: {forecast[0].date}
            </span>

            <span
              className={`text-sm ${currentTheme === "day" ? "text-gray-600" : "text-slate-300"}`}
            >
              <CityClock timezone={weather?.timezone} />
            </span>
          </div>
        </div>

        {/* Scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {forecast.map((day, index) => (
            <div
              key={day.date}
              className={`min-w-[120px] flex-shrink-0 rounded-2xl  p-4 text-center backdrop-blur-md shadow-md ${currentTheme === "day" ? "bg-white/60" : "bg-slate-700/60"}`}
            >
              <p
                className={`text-sm font-semibold ${currentTheme === "day" ? "text-sky-800" : "text-cyan-200"}`}
              >
                {formatDay(day.date, index)}
              </p>

              <div className="my-3 text-4xl">
                {getWeatherIcon(day.weatherCode)}
              </div>

              <p
                className={`text-xs ${currentTheme === "day" ? "text-gray-600" : "text-slate-300"}`}
              >
                {getWeatherCondition(day.weatherCode)}
              </p>

              <p
                className={`mt-2 text-xl font-bold ${currentTheme === "day" ? "text-sky-900" : "text-white"}`}
              >
                {Math.floor(day.maxTemp)}°C
              </p>

              <p
                className={`text-xs ${currentTheme === "day" ? "text-gray-500" : "text-slate-300"}`}
              >
                Min: {Math.floor(day.minTemp)}°C
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ForecastSection;
