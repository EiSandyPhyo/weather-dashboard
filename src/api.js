export async function getWeatherByCity(city) {
  const response = await fetch(`https://wttr.in/${city}?format=j1`)

  if (!response.ok) {
    throw new Error('Failed to fetch weather data.')
  }

  const data = await response.json()
  return data
}