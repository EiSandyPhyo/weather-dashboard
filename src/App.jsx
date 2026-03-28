// eslint-disable no-unused-vars 
import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");

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
                className="flex-1 rounded-xl border border-sky-200 px-4 py-3 outline-none focus:border-sky-500"
              />
              <button className="rounded-xl bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700">
                Search
              </button>
            </div>
          </div>

          <div className="mb-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
            Current input: {city || "Nothing typed yet"}
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-sky-800">
              Weather Information
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>City: --</p>
              <p>Temperature: --</p>
              <p>Condition: --</p>
              <p>Humidity: --</p>
              <p>Wind Speed: --</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-sky-800 capitalize">
              favorite cities
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>No favorite cities yet.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
