// scripts/fetchCountries.mjs
// Eseguendo questo script e salvando l'output in src/data/countries.json, avrai il database completo.
const fetchCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,capital,continents,latlng,borders,population,flags');
  const data = await response.json();

  const formatted = data.map(c => ({
    code: c.cca2,
    name: c.name.common,
    capital: c.capital?.[0] || "N/A",
    continent: c.continents?.[0] || "Unknown",
    latitude: c.latlng[0],
    longitude: c.latlng[1],
    borders: c.borders || [],
    flagEmoji: c.flag || "🏳️", // Nota: REST Countries fornisce già l'emoji
    population: c.population
  })).sort((a, b) => a.name.localeCompare(b.name));

  console.log(JSON.stringify(formatted, null, 2));
};

fetchCountries();