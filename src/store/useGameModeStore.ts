// src/store/useGameModeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameModeState {
  mode: 'daily' | 'training';
  setMode: (mode: 'daily' | 'training') => void;
  toggleMode: (targetMode?: 'daily' | 'training') => void;
}

export const useGameModeStore = create<GameModeState>()(
  persist(
    (set) => ({
      mode: 'daily', // Modalità predefinita
      setMode: (newMode) => set({ mode: newMode }),
      toggleMode: (targetMode) => 
        set((state) => ({ 
          mode: targetMode || (state.mode === 'daily' ? 'training' : 'daily') 
        })),
    }),
    {
      name: 'geolab-mode-storage', // Chiave nel localStorage
    }
  )
);