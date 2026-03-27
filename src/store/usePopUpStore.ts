// src/store/usePopUpStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PopUpState {
  score: number;
  highScore: number;
  updateScore: (isCorrect: boolean) => void;
  resetScore: () => void;
}

export const usePopUpStore = create<PopUpState>()(
  persist(
    (set) => ({
      score: 0,
      highScore: 0,
      updateScore: (isCorrect) => set((state) => {
        if (isCorrect) {
          const newScore = state.score + 1;
          return { 
            score: newScore, 
            highScore: Math.max(newScore, state.highScore) 
          };
        }
        return { score: 0 };
      }),
      resetScore: () => set({ score: 0 }),
    }),
    { name: 'popup-storage' }
  )
);