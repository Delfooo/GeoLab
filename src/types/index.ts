// src/types/index.ts

export interface Country {
  code: string;
  name: string;
  capital: string;
  continent: string;
  latitude: number;
  longitude: number;
  borders: string[];
  flagEmoji: string;
  population: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';