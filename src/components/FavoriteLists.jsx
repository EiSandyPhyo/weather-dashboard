import React from "react";

const FavoriteLists = ({ favorites, handleSearch, handleRemoveFavorite }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-sky-800 capitalize">
        favorite cities
      </h2>
      {favorites.length > 0 ? (
        <ul className="space-y-2 text-gray-700">
          {favorites.map((favoriteCity, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2 hover:bg-sky-100 transition"
            >
              <button
                type="button"
                onClick={() => handleSearch(favoriteCity)}
                className="text-left font-medium text-sky-700 hover:italic cursor-pointer hover:text-sky-800 hover:text-xl transition-all"
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
        <p className="text-gray-500">No favorite cities yet.</p>
      )}
    </div>
  );
};

export default FavoriteLists;
