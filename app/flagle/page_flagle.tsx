// FlaglePage.tsx
// Selezione del paese tramite SearchBar.
// Visualizzazione progressiva della bandiera.
// Indizi su distanza e direzione per ogni errore.
// Stato di vittoria/sconfitta.

'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../../src/components/shared/SearchBar';
import FlagDisplay from '../../src/components/game/FlagDisplay';
import { getDailyCountry } from '../../src/lib/utils';
import { Country, GameStatus } from '../../src/types/index';
import { getDistance, getDirection } from '../../src/lib/geography';
import ResultModal from '../../src/components/ResultModal'; 

export default function FlaglePage() {
  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inizializza il paese del giorno
  useEffect(() => {
    setTarget(getDailyCountry());
  }, []);

  // Gestione apertura automatica modale a fine partita
  useEffect(() => {
    if (gameStatus !== 'playing') {
      const timer = setTimeout(() => setIsModalOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing' || guesses.find(g => g.code === country.code)) return;

    // Aggiungiamo il nuovo tentativo in cima alla lista
    const newGuesses = [country, ...guesses];
    setGuesses(newGuesses);

    if (country.code === target?.code) {
      setGameStatus('won');
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
    }
  };

  if (!target) return <div className="p-10 text-center animate-pulse text-slate-400">Caricamento...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">🚩 FLAGLE</h1>
          <p className="text-slate-500 text-sm">Indovina la bandiera in 6 tentativi</p>
        </header>

        {/* Visualizzazione Bandiera Progressiva */}
        <FlagDisplay 
          countryCode={target.code} 
          step={guesses.length} 
          totalSteps={6} 
        />

        <div className="mt-8">
          {gameStatus === 'playing' ? (
            <SearchBar onSelect={handleSelect} />
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`w-full p-4 rounded-xl text-center font-bold text-white shadow-lg transition-transform active:scale-95 ${
                gameStatus === 'won' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            >
              {gameStatus === 'won' ? 'VEDI RISULTATO 🎉' : 'SCOPRI COSA ERA 🔍'}
            </button>
          )}

          {/* Lista Tentativi con Distanza e Direzione */}
          <div className="mt-6 space-y-3">
            {guesses.map((g, i) => {
              const distance = getDistance(g.latitude, g.longitude, target.latitude, target.longitude);
              const direction = getDirection(g.latitude, g.longitude, target.latitude, target.longitude);
              const isCorrect = g.code === target.code;

              return (
                <div 
                  key={g.code} 
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm font-medium animate-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{g.flagEmoji}</span>
                    <span className="truncate max-w-[140px] text-slate-700">{g.name}</span>
                  </div>
                  
                  {isCorrect ? (
                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">
                      CORRETTO
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-mono">
                      <span>{distance.toLocaleString()} km</span>
                      <span className="text-slate-800 font-bold">{direction}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modale Risultati Extra */}
      <ResultModal 
        isOpen={isModalOpen}
        status={gameStatus}
        targetCountry={target}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}