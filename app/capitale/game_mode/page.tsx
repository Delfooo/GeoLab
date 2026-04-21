'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/src/components/shared/SearchBar';
import { getDailyCountry } from '@/src/lib/utils';
import { Country, GameStatus } from '@/src/types/index';
import { getDistance, getDirection } from '@/src/lib/geography';
import ResultModal from '@/src/components/ResultModal'; 
import countriesData from '@/src/data/countries.json';

export default function CapitalleGame() {
  const params = useParams();
  const isTraining = params.mode === 'training';

  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadGame = useCallback(async () => {
    setGuesses([]);
    setGameStatus('playing');
    setIsModalOpen(false);

    if (isTraining) {
      const countries = countriesData as Country[];
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      setTarget(randomCountry);
    } else {
      const daily = await getDailyCountry();
      setTarget(daily);
    }
  }, [isTraining]);

  useEffect(() => { loadGame(); }, [loadGame]);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing' || guesses.find(g => g.code === country.code)) return;

    const newGuesses = [country, ...guesses];
    setGuesses(newGuesses);

    if (country.code === target?.code) {
      setGameStatus('won');
      setTimeout(() => setIsModalOpen(true), 1000);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      setTimeout(() => setIsModalOpen(true), 1000);
    }
  };

  if (!target) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500 animate-pulse font-black">CARICAMENTO...</div>;

  return (
    <main className="min-h-screen bg-dark-900 pt-32 pb-12 px-6 flex flex-col items-center">
    <div className="w-full max-w-md">
        
        {/* DISPLAY CAPITALE */}
        <header className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block px-6 py-2 rounded-full border border-gold-500/30 text-gold-500 text-xs font-bold uppercase tracking-[0.2em] mb-4"
          >
            Capitale di quale stato?
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            {target.capital.toUpperCase()}
          </h1>
          <div className="h-1 w-20 bg-gold-500 mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
        </header>

        <div className="space-y-8">
          {gameStatus === 'playing' ? (
            <SearchBar onSelect={handleSelect} />
          ) : (
            <button 
              onClick={loadGame}
              className="btn-gold w-full py-4 font-black tracking-widest shadow-lg"
            >
              {isTraining ? "PROSSIMA SFIDA 🔄" : "TORNA DOMANI 📅"}
            </button>
          )}

          {/* LISTA TENTATIVI */}
          <div className="space-y-3">
            {guesses.map((g) => {
              const distance = getDistance(g.latitude, g.longitude, target.latitude, target.longitude);
              const direction = getDirection(g.latitude, g.longitude, target.latitude, target.longitude);
              const isCorrect = g.code === target.code;

              return (
                <motion.div 
                  key={g.code} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm ${
                    isCorrect ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 bg-dark-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.flagEmoji}</span>
                    <span className="font-bold text-gold-100">{g.name}</span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="flex items-center gap-3 text-sm font-mono text-gold-500/70">
                      <span>{distance.toLocaleString()} km</span>
                      <span className="font-bold">{direction}</span>
                    </div>
                  )}
                  {isCorrect && <span className="text-gold-500 font-black text-xs">VITTORIA</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <ResultModal 
        isOpen={isModalOpen}
        status={gameStatus}
        targetCountry={target}
        onClose={() => setIsModalOpen(false)}
        guessesCount={guesses.length}
      />
    </main>
  );
}