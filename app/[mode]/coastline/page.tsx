'use client';

import { useState, useEffect, useCallback } from 'react';
import CoastlineDisplay from '../../../src/components/game/CoastlineDisplay';
import SearchBar from '../../../src/components/shared/SearchBar';
import ResultModal from '../../../src/components/ResultModal';
import { getTargetCountry } from '../../../src/lib/game-logic'; 
import { Country, GameStatus } from '../../../src/types/index';
import { Button } from '../../../src/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useStatsStore } from '../../../src/store/useStatsStore';

interface CoastlinePageProps {
  params: { mode: 'daily' | 'training' };
}

export default function CoastlinePage({ params }: CoastlinePageProps) {
  const { mode } = params;
  
  const recordResult = useStatsStore((state) => state.recordResult);
  
  const [target, setTarget] = useState<Country | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attempts, setAttempts] = useState<string[]>([]);

  const initGame = useCallback(async () => {
    const newTarget = await getTargetCountry(mode, 'coastline');
    setTarget(newTarget);
    setAttempts([]);
    setGameStatus('playing');
    setIsModalOpen(false);
  }, [mode]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelect = (selectedCountry: Country) => {
    if (gameStatus !== 'playing' || attempts.includes(selectedCountry.code)) return;
    
    const newAttempts = [...attempts, selectedCountry.code];
    setAttempts(newAttempts);
    
    if (selectedCountry.code === target?.code) {
      setGameStatus('won');
      recordResult('coastline', true); // Registra vittoria
      setIsModalOpen(true);
    } else if (newAttempts.length >= 6) {
      setGameStatus('lost');
      recordResult('coastline', false); // Registra sconfitta
      setIsModalOpen(true);
    }
  };

  if (!target) return <div className="min-h-screen bg-dark-900 animate-pulse" />;

  return (
    <main className="min-h-screen bg-dark-900 p-6 flex flex-col items-center justify-center">
      <header className="text-center mb-10">
        <div className="inline-block px-3 py-1 rounded-full border border-gold-500/20 text-[10px] text-gold-500 uppercase mb-2">
          {mode} Mode
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gold-gradient uppercase tracking-widest">
          COASTLINE
        </h1>
        <p className="text-gold-500/50 text-sm font-bold">Riconosci lo stato dal frammento di costa</p>
      </header>

      <div className="w-full max-w-md space-y-8">
        <CoastlineDisplay countryCode={target.code} />

        <div className="space-y-4">
          <SearchBar onSelect={handleSelect} disabled={gameStatus !== 'playing'} />
          
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  i < attempts.length 
                    ? (attempts[i] === target.code ? 'bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 border-red-500') 
                    : 'bg-dark-700 border-gold-500/30'
                }`}
              />
            ))}
          </div>

          {mode === 'training' && gameStatus !== 'playing' && (
            <Button 
              onClick={initGame}
              className="w-full flex gap-2 items-center justify-center bg-gold-600 hover:bg-gold-500 text-dark-900 font-bold"
            >
              <RotateCcw size={18} /> Prova un altro
            </Button>
          )}
        </div>
      </div>

      <ResultModal 
        isOpen={isModalOpen} 
        status={gameStatus} 
        targetCountry={target} 
        guessesCount={attempts.length}
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}