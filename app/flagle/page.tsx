'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/src/components/shared/SearchBar';
import FlagDisplay from '@/src/components/game/FlagDisplay';
import { getDailyCountry } from '@/src/lib/utils';
import { Country, GameStatus } from '@/src/types/index';
import { getDistance, getDirection } from '@/src/lib/geography';
import ResultModal from '@/src/components/ResultModal'; 
// Importiamo i dati per la modalità allenamento
import countriesData from '@/src/data/countries.json';

function FlagleGameContent() {
  const searchParams = useSearchParams();
  const isTraining = searchParams.get('mode') === 'training';

  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);
  const [showRules, setShowRules] = useState(false);

  // Funzione per caricare il paese in base alla modalità
  const loadGame = useCallback(async () => {
    // Reset stati
    setGuesses([]);
    setGameStatus('playing');
    setRevealedSteps([]);
    setIsModalOpen(false);

    if (isTraining) {
      // Modalità Allenamento: seleziona un paese casuale dal JSON
      const countries = countriesData as Country[];
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      setTarget(randomCountry);
    } else {
      // Modalità Giornaliera
      const daily = await getDailyCountry();
      setTarget(daily);
    }
  }, [isTraining]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      const timer = setTimeout(() => setIsModalOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing' || guesses.find(g => g.code === country.code)) return;

    const newGuesses = [country, ...guesses];
    setGuesses(newGuesses);

    // Logica svelamento tasselli basata sui colori
    const hasCommonColor = country.colors?.some(color => 
      target?.colors.map(c => c.toLowerCase()).includes(color.toLowerCase())
    );
    
    if (hasCommonColor || country.code === target?.code) {
      // Riveliamo un tassello basato sul numero del tentativo attuale
      setRevealedSteps(prev => [...prev, newGuesses.length - 1]);
    }

    if (country.code === target?.code) {
      setGameStatus('won');
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
    }
  };

  if (!target) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500 animate-pulse font-black">CARICAMENTO...</div>;

  return (
    <main className="min-h-screen bg-dark-900 pt-24 pb-12 px-6 flex flex-col items-center relative">
      
      {/* Popup Regole */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-sm w-full p-8 rounded-[2.5rem] border-gold-500/50 relative text-center"
            >
              <h2 className="text-2xl font-black text-gold-500 mb-4 uppercase">Come Giocare</h2>
              <ul className="text-left text-gold-100/80 space-y-4 text-sm mb-8">
                <li className="flex gap-3">
                  <span className="text-gold-500 font-bold">1.</span>
                  Indovina il paese {isTraining ? 'scelto' : 'del giorno'} in 6 tentativi.
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-500 font-bold">2.</span>
                  Ad ogni errore vedrai la distanza e la direzione.
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-500 font-bold">3.</span>
                  I colori corretti svelano parti della bandiera!
                </li>
              </ul>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowRules(false);
                }}
                className="btn-gold w-full py-3"
              >
                Ho capito
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md">
        <header className="text-center mb-8 flex flex-col items-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gold-gradient tracking-tight">FLAGLE</h1>
          <p className="text-gold-500/60 text-sm uppercase tracking-widest font-bold mt-1">
            {isTraining ? 'Modalità Allenamento' : 'Sfida Giornaliera'}
          </p>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowRules(true);
            }}
            className="mt-4 text-gold-500 hover:bg-gold-500/10 transition-all text-xs font-bold border border-gold-500/30 px-4 py-1.5 rounded-full uppercase tracking-tighter"
          >
            Regole del gioco
          </button>
        </header>

        {/* Display della bandiera */}
        <div className="glass-card p-4 rounded-[2rem] mb-8">
           <FlagDisplay 
              countryCode={target.code} 
              revealedSteps={revealedSteps}
              isGameOver={gameStatus !== 'playing'}
            />
        </div>

        <div className="space-y-6">
          {gameStatus === 'playing' ? (
            <SearchBar onSelect={handleSelect} />
          ) : (
            <div className="space-y-3">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="btn-gold w-full py-4 text-lg shadow-2xl"
              >
                {gameStatus === 'won' ? 'VEDI RISULTATO 🎉' : 'SCOPRI LA SOLUZIONE 🔍'}
              </button>
              
              {isTraining && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loadGame();
                  }}
                  className="w-full py-3 rounded-2xl border border-gold-500/50 text-gold-500 font-bold hover:bg-gold-500/10 transition-all"
                >
                  NUOVA BANDIERA 🔄
                </button>
              )}
            </div>
          )}

          <div className="space-y-3">
            {guesses.map((g) => {
              const distance = getDistance(g.latitude, g.longitude, target.latitude, target.longitude);
              const direction = getDirection(g.latitude, g.longitude, target.latitude, target.longitude);
              const isCorrect = g.code === target.code;

              return (
                <div 
                  key={g.code} 
                  className="flex items-center justify-between p-4 bg-dark-800/50 border border-gold-500/20 rounded-2xl backdrop-blur-sm animate-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.flagEmoji}</span>
                    <span className="font-bold text-gold-100">{g.name}</span>
                  </div>
                  
                  {isCorrect ? (
                    <div className="text-sm font-black text-green-500 tracking-tighter">CORRETTO!</div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-gold-500 leading-none">{Math.round(distance)} KM</span>
                        <span className="text-[10px] text-gold-100/40 font-bold uppercase tracking-tighter">Distanza</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-xl shadow-inner" style={{ transform: `rotate(${direction}deg)` }}>
                        ⬆️
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

export default function FlagleGamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500 animate-pulse font-black uppercase tracking-widest">Inizializzazione gioco...</div>}>
      <FlagleGameContent />
    </Suspense>
  );
}