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

export default function FlaglePage() {
  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

  useEffect(() => {
    setTarget(getDailyCountry() as Country);
  }, []);

  const handleSelect = (country: Country) => {
    if (gameStatus !== 'playing' || guesses.find(g => g.code === country.code)) return;

    const newGuesses = [country, ...guesses];
    setGuesses(newGuesses);

    if (country.code === target?.code) {
      setGameStatus('won');
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
    }
  };

  if (!target) return <div className="p-10 text-center">Caricamento...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">🚩 Flagle</h1>

      <FlagDisplay 
        countryCode={target.code} 
        step={guesses.length} 
        totalSteps={6} 
      />

      <div className="w-full max-w-md mt-8">
        {gameStatus === 'playing' ? (
          <SearchBar onSelect={handleSelect} />
        ) : (
          <div className={`p-4 rounded-xl text-center font-bold text-white ${gameStatus === 'won' ? 'bg-green-500' : 'bg-red-500'}`}>
            {gameStatus === 'won' ? 'Complimenti! 🎉' : `Hai perso! Era la ${target.name}`}
          </div>
        )}

        <div className="mt-6 space-y-2">
          {guesses.map((g, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
              <span>{g.flagEmoji} {g.name}</span>
              <span>{g.code === target.code ? '✅' : '❌'}</span>
            </div>
          ))}
          {/* Lista Tentativi Aggiornata */}
          <div className="mt-6 space-y-2 w-full max-w-md">
            {guesses.map((g, i) => {
              const distance = target ? getDistance(g.latitude, g.longitude, target.latitude, target.longitude) : 0;
              const direction = target ? getDirection(g.latitude, g.longitude, target.latitude, target.longitude) : '';
              const isCorrect = g.code === target?.code;

              return (
                <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span>{g.flagEmoji}</span>
                    <span className="truncate max-w-[120px]">{g.name}</span>
                  </div>
                  
                  {!isCorrect ? (
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{distance.toLocaleString()} km</span>
                      <span className="font-bold">{direction}</span>
                    </div>
                  ) : (
                    <span className="text-green-500 font-bold">TROVATO! 🎉</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}