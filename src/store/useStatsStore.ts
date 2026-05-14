// src/store/useStatsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStats {
  gamesPlayed: number;
  victories: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed: string | null;
}

interface DailyStatus {
  hasPlayed: boolean;
  lastPlayedDate: string | null;
  won: boolean;
  guesses: any[]; 
}

interface StatsState {
  username: string;
  avatarSeed: string;
  lastUsernameUpdate: number;
  unlockedBadges: string[];
  activeTheme: 'default' | 'silver' | 'gold';

  global: GameStats;
  games: {
    flagle: GameStats;
    capitale: GameStats;
    bordle: GameStats;
    coastline: GameStats;
  };
  dailyChallenge: {
    flagle: DailyStatus;
    capitale: DailyStatus;
    bordle: DailyStatus;
    coastline: DailyStatus;
  };

  recordResult: (gameId: 'flagle' | 'capitale' | 'bordle' | 'coastline', won: boolean) => void;
  recordDailyResult: (gameId: 'flagle' | 'capitale' | 'bordle' | 'coastline', won: boolean, guesses: any[]) => void;
  updateUsername: (newName: string) => { success: boolean; message: string };
  updateAvatar: () => void;
  setTheme: (theme: 'default' | 'silver' | 'gold') => void;
}

const initialGameStats: GameStats = {
  gamesPlayed: 0,
  victories: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayed: null,
};

const initialDaily: DailyStatus = { 
  hasPlayed: false, 
  lastPlayedDate: null, 
  won: false, 
  guesses: [] 
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      username: 'Esploratore',
      avatarSeed: Math.random().toString(36).substring(7),
      lastUsernameUpdate: 0,
      unlockedBadges: [],
      activeTheme: 'default',
      
      global: { ...initialGameStats },
      games: {
        flagle: { ...initialGameStats },
        capitale: { ...initialGameStats }, 
        bordle: { ...initialGameStats },  
        coastline: { ...initialGameStats },
      },

      dailyChallenge: {
        flagle: { ...initialDaily },
        capitale: { ...initialDaily },
        bordle: { ...initialDaily },
        coastline: { ...initialDaily },
      },

      updateUsername: (newName) => {
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const state = get();

        if (newName.trim().length === 0) return { success: false, message: "Lo username non può essere vuoto." };
        if (newName.length > 20) return { success: false, message: "Massimo 20 caratteri." };
        
        if (now - state.lastUsernameUpdate < oneWeek && state.lastUsernameUpdate !== 0) {
          const diff = oneWeek - (now - state.lastUsernameUpdate);
          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
          return { success: false, message: `Attendi ancora ${days} giorni.` };
        }

        set({ username: newName, lastUsernameUpdate: now });
        return { success: true, message: "Username aggiornato!" };
      },

      updateAvatar: () => set({ avatarSeed: Math.random().toString(36).substring(7) }),

      setTheme: (theme) => set({ activeTheme: theme }),

      recordDailyResult: (gameId, won, guesses) => set((state) => ({
        dailyChallenge: {
          ...state.dailyChallenge,
          [gameId]: {
            hasPlayed: true,
            lastPlayedDate: new Date().toLocaleDateString(),
            won,
            guesses
          }
        }
      })),

      recordResult: (gameId, won) =>
        set((state) => {
          const today = new Date().toLocaleDateString();
          const gameStats = state.games[gameId];
          
          const newGameStats = {
            ...gameStats,
            gamesPlayed: gameStats.gamesPlayed + 1,
            victories: won ? gameStats.victories + 1 : gameStats.victories,
            currentStreak: won ? gameStats.currentStreak + 1 : 0,
            bestStreak: won 
              ? Math.max(gameStats.bestStreak, gameStats.currentStreak + 1) 
              : gameStats.bestStreak,
            lastPlayed: today,
          };

          const newGlobalStats = {
            ...state.global,
            gamesPlayed: state.global.gamesPlayed + 1,
            victories: won ? state.global.victories + 1 : state.global.victories,
            currentStreak: won ? state.global.currentStreak + 1 : 0,
            bestStreak: won 
              ? Math.max(state.global.bestStreak, state.global.currentStreak + 1) 
              : state.global.bestStreak,
            lastPlayed: today,
          };

          const badges = [...state.unlockedBadges];
          if (newGlobalStats.victories >= 10 && !badges.includes('10v')) badges.push('10v');
          if (newGlobalStats.bestStreak >= 5 && !badges.includes('5s')) badges.push('5s');
          if (newGlobalStats.victories >= 50 && !badges.includes('pro')) badges.push('pro');

          return {
            games: { ...state.games, [gameId]: newGameStats },
            global: newGlobalStats,
            unlockedBadges: badges
          };
        }),
    }),
    { name: 'geolab-stats-storage' }
  )
);