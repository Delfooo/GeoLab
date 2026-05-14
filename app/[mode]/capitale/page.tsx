'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../../../src/components/shared/SearchBar';
import ResultModal from '../../../src/components/ResultModal';
import { getTargetCountry } from '../../../src/lib/game-logic';
import { getDistance, getDirection } from '../../../src/lib/geography';
import { Country, GameStatus } from '../../../src/types/index';
import { RotateCcw, MapPin, Navigation2 } from 'lucide-react';
import { useStatsStore } from '../../../src/store/useStatsStore';

interface CapitalePageProps {
  params: { mode: 'daily' | 'training' };
}

export default function CapitalePage({ params }: CapitalePageProps) {
  const { mode } = params;

  const recordResult = useStatsStore((state) => state.recordResult);

  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initGame = useCallback(async () => {
    const newTarget = await getTargetCountry(mode, 'capitale');
    setTarget(newTarget);
    setGuesses([]);
    setGameStatus('playing');
    setIsModalOpen(false);
  }, [mode]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing' || guesses.find(g => g.code === country.code)) return;

    const newGuesses = [country, ...guesses];
    setGuesses(newGuesses);

    if (country.code === target?.code) {
      setGameStatus('won');
      recordResult('capitale', true); // Registra vittoria nel database locale
      setTimeout(() => setIsModalOpen(true), 800);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      recordResult('capitale', false); // Registra sconfitta nel database locale
      setTimeout(() => setIsModalOpen(true), 800);
    }
    
    if (navigator.vibrate) navigator.vibrate(50);
  };

  if (!target) return <div className="min-h-screen bg-dark-900 animate-pulse" />;

  return (
    <main className="min-h-screen bg-dark-900 pt-20 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full border border-gold-500/20 text-[10px] text-gold-500 uppercase mb-2 font-bold tracking-widest">
            {mode} Mode
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gold-gradient tracking-tighter uppercase">
            CAPITALLE
          </h1>
          <div className="mt-6 flex flex-col items-center">
            <p className="text-gold-500/50 text-xs font-bold uppercase tracking-widest mb-2">Indovina lo stato della capitale:</p>
            <div className="bg-gold-500/10 border border-gold-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
              <MapPin className="text-gold-500" size={20} />
              <span className="text-2xl font-black text-white uppercase tracking-tight">
                {target.capital}
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {gameStatus === 'playing' ? (
            <SearchBar onSelect={handleSelect} />
          ) : (
            <div className="flex flex-col gap-3">
              {mode === 'training' && (
                <button 
                  onClick={initGame}
                  className="w-full py-4 bg-gold-600 text-dark-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gold-500 transition-all uppercase shadow-lg shadow-gold-600/20"
                >
                  <RotateCcw size={20} /> Prossima Capitale
                </button>
              )}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 border border-gold-500/30 text-gold-500 font-bold rounded-2xl uppercase hover:bg-gold-500/5 transition-all"
              >
                Visualizza Risultato
              </button>
            </div>
          )}

          <div className="space-y-3">
            <AnimatePresence>
              {guesses.map((g) => {
                const distance = getDistance(g.latlng[0], g.latlng[1], target.latlng[0], target.latlng[1]);
                const direction = getDirection(g.latlng[0], g.latlng[1], target.latlng[0], target.latlng[1]);
                const isCorrect = g.code === target.code;

                return (
                  <motion.div 
                    key={g.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-dark-800/80 border border-gold-500/10 rounded-2xl shadow-xl"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{g.flagEmoji}</span>
                        <span className="font-bold text-gold-100 uppercase text-sm">{g.name}</span>
                      </div>
                      <span className="text-[10px] text-gold-500/50 font-bold ml-8">{g.capital}</span>
                    </div>
                    
                    {isCorrect ? (
                      <div className="bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full">
                        <span className="text-[10px] font-black text-green-500 uppercase">Target!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-black text-gold-500">{Math.round(distance)} KM</p>
                        </div>
                        <div 
                          className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20"
                          style={{ transform: `rotate(${direction}deg)` }}
                        >
                          <Navigation2 size={16} className="text-gold-500 fill-gold-500" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ResultModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        status={gameStatus}
        targetCountry={target}
        guessesCount={guesses.length}
      />
    </main>
  );
}