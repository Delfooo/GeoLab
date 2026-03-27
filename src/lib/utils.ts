import countries from '../../src/data/countries.json';
import { Country } from '../../src/types/index';

export const getDailyCountry = (): Country => {
  const today = new Date();
  // Il seed cambia ogni 24 ore a mezzanotte
  const seedString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Funzione di hashing semplice per trasformare la stringa in un indice numerico
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0; 
  }
  
  const index = Math.abs(hash) % countries.length;
  return countries[index] as Country;
};