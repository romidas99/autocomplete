const API_KEY = import.meta.env.VITE_OWM_KEY; // Add to .env file

export const fetchLocations = async (query: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};