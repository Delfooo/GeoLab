// seed-countries.mjs
import fs from 'fs';

const fetchCountries = async () => {
  console.log("⏳ Recupero dati da REST Countries...");
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,capital,continents,latlng,borders,population,flags');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to fetch REST Countries data`);
    }
    
    const formatted = data
      .filter(c => c.latlng && c.latlng.length === 2) // Filtriamo territori senza coordinate chiare
      .map(c => ({
        code: c.cca2,
        name: c.name.common,
        capital: c.capital?.[0] || "N/A",
        continent: c.continents?.[0] || "Unknown",
        latitude: c.latlng[0],
        longitude: c.latlng[1],
        borders: c.borders || [],
        flagEmoji: c.flag || "🏳️",
        population: c.population
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync('./src/data/countries.json', JSON.stringify(formatted, null, 2));
    console.log(`✅ Successo! ${formatted.length} paesi salvati in src/data/countries.json`);
  } catch (error) {
    console.error("❌ Errore durante il fetching:", error);
  }
};

fetchCountries();