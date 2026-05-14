import { getAllCountries } from './api';
import { Country } from '../types';

export async function getDailyCountry(): Promise<Country | null> {
  try {
    const countries = await getAllCountries();
    if (countries.length === 0) return null;

    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Filtriamo i paesi "reali" (escludendo micro-isole se vuoi un gioco più semplice)
    const filtered = countries.filter(c => c.latlng && c.latlng.length === 2);
    
    const index = seed % filtered.length;
    return filtered[index];
  } catch (error) {
    console.error('Error fetching daily country:', error);
    return null;
  }
}