// src/lib/game-logic.ts
import { Country } from '../types/index';

// Dato che l'API restituisce molti dati, definiamo una funzione per pescare la lista
export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,latlng,flags,capital,region,population,borders', {
      next: { revalidate: 3600 } // Opzionale: cache dei dati per un'ora
    });
    
    if (!res.ok) throw new Error("Errore risposta API");
    
    const data = await res.json();
    return data.map((c: any) => ({
      id: c.cca2,
      name: c.name.common,
      code: c.cca2,
      latlng: c.latlng || [0, 0], // Fallback per latlng mancanti
      flagEmoji: c.flag || '',
      capital: c.capital?.[0] || 'N/A',
      region: c.region,
      population: c.population,
      borders: c.borders || [],
      colors: []
    }));
  } catch (error) {
    console.error("Impossibile recuperare i paesi:", error);
    return []; // Ritorna array vuoto invece di bloccare tutto
  }
};

export const getTargetCountry = async (mode: string, gameSeed: string): Promise<Country> => {
  const countries = await fetchCountries();

  if (mode === 'daily') {
    const today = new Date().toISOString().slice(0, 10);
    const combinedSeed = `${today}-${gameSeed}`;
    
    const hash = combinedSeed.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const index = Math.abs(hash) % countries.length;
    return countries[index];
  }

  // Modalità Training: Selezione casuale
  return countries[Math.floor(Math.random() * countries.length)];
};