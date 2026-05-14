// src/types/index.ts o src/types/country.ts

export type GameStatus = 'playing' | 'won' | 'lost';

export interface Country {
  id: string;        // ISO 3166-1 alpha-3 (es. "ITA")
  code: string;      // Alias spesso usato nel codice (es. "ITA")
  name: string;
  capital: string;
  region: string;
  population: number;
  latlng: [number, number];
  borders: string[];
  flagEmoji: string;
  colors?: string[]; // Opzionale, utile per Flagle
}