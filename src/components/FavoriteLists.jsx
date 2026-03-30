import React from "react";

const FavoriteLists = ({
  favorites,
  handleSearch,
  handleRemoveFavorite,
  currentTheme,
}) => {
  return (
    <div
      className={`rounded-2xl p-6 shadow-md transition-colors duration-500 ${
        currentTheme === "day" ? "bg-white" : "bg-slate-800"
      }`}
    >
      <h2
        className={`mb-4 text-2xl font-semibold capitalize ${
          currentTheme === "day" ? "text-sky-800" : "text-white"
        }`}
      >
        favorite cities
      </h2>
      {favorites.length > 0 ? (
        <ul className="space-y-2 text-gray-700">
          {favorites.map((favoriteCity, index) => (
            <li
              key={index}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                currentTheme === "day"
                  ? "bg-sky-50 hover:bg-sky-100"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSearch(favoriteCity)}
                className={`cursor-pointer text-left font-medium transition-all hover:italic ${
                  currentTheme === "day"
                    ? "text-sky-700 hover:text-sky-800 hover:text-xl"
                    : "text-white hover:text-white hover:text-xl"
                }`}
              >
                {favoriteCity}
              </button>

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
        <p
          className={
            currentTheme === "day" ? "text-gray-500" : "text-slate-300"
          }
        >
          No favorite cities yet. Add some!
        </p>
      )}
    </div>
  );
};

export default FavoriteLists;
