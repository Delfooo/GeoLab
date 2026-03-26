import countries from '../../src/data/countries.json';
import { Country } from '../../src/types/index';

export const getDailyCountry = () => {
  const today = new Date();
  // Creiamo un numero unico basato sulla data (es. 20260326)
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Usiamo il seed per scegliere un indice nell'array dei paesi
  const index = seed % countries.length;
  return countries[index] as Country;
};