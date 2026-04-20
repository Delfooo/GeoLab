'use client';

import { useState, useEffect } from 'react';
import CoastlineDisplay from '@/src/components/game/CoastlineDisplay';
import SearchBar from '@/src/components/shared/SearchBar';
import ResultModal from '@/src/components/ResultModal';
import { getDailyCountry } from '@/src/lib/utils';
import { Country, GameStatus } from '@/src/types/index';

export default function CoastlinePage() {
  const [target, setTarget] = useState<Country | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setAttempts(0);
  }, [target]);
  
  useEffect(() => {
    const fetchCountry = async () => {
      const country = await getDailyCountry(); 
      setTarget(country);
    };
    fetchCountry();
}, []);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing') return;
    
    setAttempts(prev => prev + 1);
    
    if (country.code === target?.code) {
      setGameStatus('won');
      setIsModalOpen(true);
    } else if (attempts >= 5) {
      setGameStatus('lost');
      setIsModalOpen(true);
    }
  };

  if (!target) return null;

  return (
    <main className="min-h-screen bg-dark-900 p-6 flex flex-col items-center justify-center">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gold-gradient uppercase tracking-widest">
          COASTLINE
        </h1>
        <p className="text-gold-500/50 text-sm font-bold">Riconosci lo stato dalla sua ombra</p>
      </header>

      <div className="w-full max-w-md space-y-8">
        <CoastlineDisplay countryCode={target.code} />

        <div className="space-y-4">
          <SearchBar onSelect={handleSelect} disabled={gameStatus !== 'playing'} />
          
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full border border-gold-500/30 ${
                  i < attempts ? 'bg-red-500' : 'bg-dark-700'
                } ${gameStatus === 'won' && i === attempts - 1 ? 'bg-gold-500 shadow-[0_0_10px_#EAB308]' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

        <ResultModal 
          isOpen={isModalOpen} 
          status={gameStatus} 
          targetCountry={target} 
          guessesCount={attempts}
          onClose={() => setIsModalOpen(false)} 
        />
    </main>
  );
}