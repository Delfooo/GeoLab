import { Country } from '../../src/types/index';

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,capital,continents,latlng,borders,flags';

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(REST_COUNTRIES_URL);
    if (!response.ok) throw new Error('Errore nel recupero dei paesi');
    
    const data = await response.json();

    return data.map((c: any) => ({
      code: c.cca2,
      name: c.name.common,
      capital: c.capital?.[0] || 'N/A',
      continent: c.continents?.[0] || 'Unknown',
      latitude: c.latlng[0],
      longitude: c.latlng[1],
      borders: c.borders || [],
      flagEmoji: c.flag || '🏳️', // Alcune API non danno l'emoji, usiamo un fallback
      // Logica colori semplificata: l'API non dà i colori esatti delle bandiere.
      // Per Flagle, potremmo dover mantenere un piccolo mapping o dedurli.
      colors: getColorsByContinent(c.continents?.[0]) // Placeholder per ora
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Funzione temporanea per non rompere la logica dei colori di Flagle
function getColorsByContinent(continent: string): string[] {
  const common = ["red", "white", "blue", "yellow", "green"];
  return common; // Per ora passiamo i colori base per i test
}