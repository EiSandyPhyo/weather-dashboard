/* eslint-disable no-unused-vars */
import React from "react";

const SearchBar = ({
  city,
  setCity,
  handleKeyDown,
  handleSearch,
  handleUseCurrentLocation,
  isLoading,
  errorMsg,
}) => {
  return (
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
          onClick={() => handleSearch(city)}
          disabled={isLoading}
          className={`rounded-xl px-5 py-3 font-medium text-white transition ${
            isLoading
              ? "cursor-not-allowed bg-sky-400"
              : "cursor-pointer bg-sky-600 hover:bg-sky-700"
          }
          `}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading}
        className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        Use My Location
      </button>
      <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
    </div>
  );
};

export default SearchBar;
