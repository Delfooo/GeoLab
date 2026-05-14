'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../../../src/components/shared/SearchBar';
import ResultModal from '../../../src/components/ResultModal';
import { getTargetCountry } from '../../../src/lib/game-logic';
import { Country, GameStatus } from '../../../src/types/index';
import { RotateCcw, Map as MapIcon } from 'lucide-react';
import { useStatsStore } from '../../../src/store/useStatsStore';

interface BorderlePageProps {
  params: { mode: 'daily' | 'training' };
}

export default function BorderlePage({ params }: BorderlePageProps) {
  const { mode } = params;

  const recordResult = useStatsStore((state) => state.recordResult);

  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedBordersCount, setRevealedBordersCount] = useState(1);

  const initGame = useCallback(async () => {
    const newTarget = await getTargetCountry(mode, 'borderle');
    setTarget(newTarget);
    setGuesses([]);
    setGameStatus('playing');
    setRevealedBordersCount(1);
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
      recordResult('bordle', true); // Registra vittoria (usando la chiave 'bordle' come nello store)
      setTimeout(() => setIsModalOpen(true), 800);
    } else {
      if (target?.borders && revealedBordersCount < target.borders.length) {
        setRevealedBordersCount(prev => prev + 1);
      }

      if (newGuesses.length >= 6) {
        setGameStatus('lost');
        recordResult('bordle', false); // Registra sconfitta
        setTimeout(() => setIsModalOpen(true), 800);
      }
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
            BORDERLE
          </h1>
          <p className="text-gold-500/50 text-xs font-bold uppercase tracking-widest mt-2">
            Indovina lo stato dai suoi vicini
          </p>
        </header>

        <div className="bg-dark-800/50 p-6 rounded-[2rem] border border-gold-500/10 mb-8 shadow-inner text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mb-2">
              <MapIcon className="text-gold-500" size={24} />
            </div>
            <h3 className="text-gold-100/40 text-[10px] font-black uppercase tracking-widest">
              Confini Rilevati ({revealedBordersCount}/{target.borders?.length || 0})
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {target.borders?.slice(0, revealedBordersCount).map((borderIso) => (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={borderIso}
                  className="px-3 py-1 bg-dark-700 border border-gold-500/20 rounded-lg text-xs font-bold text-gold-500"
                >
                  {borderIso}
                </motion.div>
              ))}
              {(!target.borders || target.borders.length === 0) && (
                <span className="text-gold-500 text-sm font-bold">Nessun confine terrestre (Isola)</span>
              )}
            </div>
          </div>
        </div>

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
                  <RotateCcw size={20} /> Prossima Sfida
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
              {guesses.map((g) => (
                <motion.div 
                  key={g.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-dark-800/80 border border-gold-500/10 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{g.flagEmoji}</span>
                    <span className="font-bold text-gold-100 uppercase text-sm">{g.name}</span>
                  </div>
                  {g.code === target.code ? (
                    <div className="bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full">
                      <span className="text-[10px] font-black text-green-500 uppercase">Esatto</span>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                      <span className="text-[10px] font-black text-red-500/60 uppercase">Errato</span>
                    </div>
                  )}
                </motion.div>
              ))}
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