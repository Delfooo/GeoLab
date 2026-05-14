'use client';

import { useState, useEffect, useCallback, use } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../../../src/components/shared/SearchBar';
import FlagDisplay from '../../../src/components/game/FlagDisplay';
import ResultModal from '../../../src/components/ResultModal';
import { getTargetCountry } from '../../../src/lib/game-logic';
import { getDistance, getDirection } from '../../../src/lib/geography';
import { Country, GameStatus } from '../../../src/types/index';
import { useStatsStore } from '../../../src/store/useStatsStore';
import { RotateCcw, Info } from 'lucide-react';

interface FlaglePageProps {
  params: Promise<{ mode: 'daily' | 'training' }>;
}

export default function FlaglePage({ params }: FlaglePageProps) {
  const { mode } = use(params);

  const recordResult = useStatsStore((state) => state.recordResult);
  const recordDailyResult = useStatsStore((state) => state.recordDailyResult);
  const dailyStatus = useStatsStore((state) => state.dailyChallenge.flagle);

  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);
  const [showRules, setShowRules] = useState(false);

  const initGame = useCallback(async () => {
    const today = new Date().toLocaleDateString();

    // 1. LOGICA DAILY: Se ha già giocato oggi, carica lo stato salvato
    if (mode === 'daily' && dailyStatus.hasPlayed && dailyStatus.lastPlayedDate === today) {
      const dailyTarget = await getTargetCountry('daily', 'flagle');
      setTarget(dailyTarget);
      setGuesses(dailyStatus.guesses);
      setGameStatus(dailyStatus.won ? 'won' : 'lost');
      setRevealedSteps(Array.from({ length: 9 }, (_, i) => i)); // Rivela tutto
      setIsModalOpen(true);
      return;
    }

    // 2. LOGICA NORMAL: Reset per Training o Nuova Daily
    setTarget(null);
    setRevealedSteps([]);
    setGuesses([]);
    setGameStatus('playing');
    setIsModalOpen(false);

    try {
      const newTarget = await getTargetCountry(mode, 'flagle');
      if (!newTarget) throw new Error("Paese non trovato");
      setTarget(newTarget);
    } catch (error) {
      console.error(error);
      alert("Errore di connessione.");
    }
  }, [mode, dailyStatus]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing' || guesses.find(g => g.code === country.code)) return;

    const newGuesses = [country, ...guesses];
    setGuesses(newGuesses);

    // Svelamento tasselli casuali
    if (country.code !== target?.code) {
      const availableSteps = Array.from({ length: 9 }, (_, i) => i).filter(s => !revealedSteps.includes(s));
      if (availableSteps.length > 0) {
        const randomStep = availableSteps[Math.floor(Math.random() * availableSteps.length)];
        setRevealedSteps(prev => [...prev, randomStep]);
      }
    }

    // Controllo fine partita
    if (country.code === target?.code || newGuesses.length >= 9) {
      const won = country.code === target?.code;
      setGameStatus(won ? 'won' : 'lost');
      
      // Salva permanentemente se Daily
      if (mode === 'daily') {
        recordDailyResult('flagle', won, newGuesses);
      }
      
      recordResult('flagle', won);
      setTimeout(() => setIsModalOpen(true), 1000);
    }
  };

  if (!target) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500 animate-pulse font-black uppercase">
      Caricamento Flagle...
    </div>
  );

  return (
  <main className="min-h-screen bg-dark-900 pt-20 pb-12 px-6 flex flex-col items-center relative">
    {/* Regole sovrapposte */}
    <AnimatePresence>
      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-800 max-w-sm w-full p-8 rounded-[2.5rem] border border-gold-500/30 text-center shadow-2xl"
          >
            <h2 className="text-2xl font-black text-gold-500 mb-4 uppercase">Regole</h2>
            <ul className="text-left text-gold-100/70 space-y-4 text-sm mb-8">
              <li className="flex gap-3"><span className="text-gold-500 font-bold">1.</span> Indovina la bandiera in 9 tentativi.</li>
              <li className="flex gap-3"><span className="text-gold-500 font-bold">2.</span> Ogni errore svela un pezzo casuale della bandiera.</li>
              <li className="flex gap-3"><span className="text-gold-500 font-bold">3.</span> Distanza e freccia ti guidano verso il target.</li>
            </ul>
            <button onClick={() => setShowRules(false)} className="w-full py-3 bg-gold-600 text-dark-900 font-black rounded-xl uppercase">Ho capito</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <div className="w-full max-w-md">
      <header className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full border border-gold-500/20 text-[10px] text-gold-500 uppercase mb-2 font-bold tracking-widest">
          {mode} Mode
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gold-gradient tracking-tighter uppercase">FLAGLE</h1>
        <button 
          onClick={() => setShowRules(true)}
          className="mt-4 flex items-center gap-2 mx-auto text-gold-500/50 hover:text-gold-500 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <Info size={14} /> Regole
        </button>
      </header>

      <div className="bg-dark-800/50 p-4 rounded-[2rem] border border-gold-500/10 mb-8 shadow-inner min-h-[250px] flex items-center justify-center">
        {target ? (
          <FlagDisplay 
            countryCode={target.code} 
            revealedSteps={revealedSteps}
            isGameOver={gameStatus !== 'playing'}
            gridSize={9}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            <p className="text-gold-500/50 text-xs font-bold uppercase tracking-widest">Caricamento...</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {gameStatus === 'playing' ? (
          <SearchBar onSelect={handleSelect} />
        ) : (
          <div className="flex flex-col gap-3">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-gold-600 text-dark-900 font-black rounded-2xl shadow-lg hover:bg-gold-500 transition-all uppercase"
            >
              Visualizza Risultato
            </button>
            
            {/* Logica Condizionale: Training vs Daily */}
            {mode === 'training' ? (
              <button 
                onClick={initGame}
                className="w-full py-3 border border-gold-500/30 text-gold-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gold-500/5 transition-all uppercase text-sm"
              >
                <RotateCcw size={18} /> Prossima bandiera
              </button>
            ) : (
              <div className="text-center p-6 bg-gold-500/5 border border-gold-500/20 rounded-2xl">
                <p className="text-gold-500 font-black text-xs uppercase tracking-tighter">
                  Sfida giornaliera completata!
                </p>
                <p className="text-gold-100/40 text-[10px] uppercase mt-1">
                  Torna domani per una nuova bandiera
                </p>
              </div>
            )}
          </div>
        )}

        {/* Lista Tentativi */}
        <div className="space-y-3">
          {guesses.map((g, index) => {
            const gLat = g.latlng?.[0] ?? 0;
            const gLng = g.latlng?.[1] ?? 0;
            const tLat = target?.latlng?.[0] ?? 0;
            const tLng = target?.latlng?.[1] ?? 0;

            const distance = getDistance(gLat, gLng, tLat, tLng);
            const direction = getDirection(gLat, gLng, tLat, tLng);
            const isCorrect = g.code === target?.code;

            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={`${g.code}-${index}`} 
                className="flex items-center justify-between p-4 bg-dark-800/80 border border-gold-500/10 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{g.flagEmoji}</span>
                  <span className="font-bold text-gold-100 truncate max-w-[120px]">{g.name}</span>
                </div>
                
                {isCorrect ? (
                  <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Vittoria</span>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gold-500">{Math.round(distance)} KM</p>
                    </div>
                    <div 
                      className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20 shadow-inner text-gold-500"
                      style={{ transform: `rotate(${direction}deg)` }}
                    >
                      <span className="text-[18px] leading-none">⬆</span>
                    </div>
                  </div>
                )}
              </motion.div>
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
)};