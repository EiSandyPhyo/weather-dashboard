/* eslint-disable no-unused-vars */
import React from "react";
import searchLocationIcon from "../assets/search-location.png";
import locationIcon from "../assets/location.png";

const SearchBar = ({
  city,
  setCity,
  handleKeyDown,
  handleSearch,
  handleUseCurrentLocation,
  isLoading,
  errorMsg,
  currentTheme,
}) => {
  return (
    <div
      className={`mb-6 rounded-2xl p-4 shadow-md transition-colors duration-500 ${
        currentTheme === "day" ? "bg-white" : "bg-slate-800"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`flex-1 rounded-xl border px-4 py-3 outline-none ${
            isLoading
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : currentTheme === "day"
                ? "border-sky-200 focus:border-sky-500"
                : "border-slate-600 bg-slate-700 text-white placeholder:text-slate-300 focus:border-cyan-400"
          }`}
        />

        <button
          type="button"
          onClick={() => handleSearch(city)}
          disabled={isLoading}
          className={`${isLoading ? "cursor-not-allowed " : "cursor-pointer"}
          `}
        >
          <span className="sm:hidden">
            <img
              src={searchLocationIcon}
              alt="search location"
              className="w-10 h-10 my-auto cursor-pointer ml-1"
            />
          </span>
          <span
            className={`hidden sm:inline rounded-xl px-5 py-3 font-medium text-white transition ${
              isLoading
                ? "cursor-not-allowed bg-sky-400"
                : "cursor-pointer bg-sky-600 hover:bg-sky-700"
            }
          `}
          >
            {isLoading ? "Loading..." : "Search"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className=""
        >
          <img
            src={locationIcon}
            alt="location"
            className="w-10 h-10 my-auto cursor-pointer"
          />
        </button>
      </div>

      <p
        className={`text-sm mt-2  ${currentTheme === "day" ? "text-red-400" : "text-red-300"}`}
      >
        {errorMsg}
      </p>
    </div>
  );
};

export default SearchBar;
