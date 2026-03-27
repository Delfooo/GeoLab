// src/store/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStatus, Country } from '../types';

interface GameState {
  guesses: Country[];
  status: GameStatus;
  addGuess: (country: Country, target: Country) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      guesses: [],
      status: 'playing',
      addGuess: (country, target) => 
        set((state) => {
          const newGuesses = [...state.guesses, country];
          const hasWon = country.code === target.code;
          const hasLost = newGuesses.length >= 6 && !hasWon;
          
          return {
            guesses: newGuesses,
            status: hasWon ? 'won' : hasLost ? 'lost' : 'playing',
          };
        }),
      resetGame: () => set({ guesses: [], status: 'playing' }),
    }),
    { name: 'geolab-storage' }
  )
);