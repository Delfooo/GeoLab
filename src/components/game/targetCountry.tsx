'use client';

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getCountryNameByCode } from '../../lib/geography';
import SearchBar from '../../components/shared/SearchBar';
import { Country } from '../../types';

interface TargetCountryProps {
  targetCountry: Country;
}

export default function TargetCountry({ targetCountry }: TargetCountryProps) {
  const { guesses, addGuess, status } = useGameStore();

  // Calcoliamo quanti indizi (confini) mostrare in base ai tentativi fatti
  // Se non ci sono confini (es. isole come il Giappone), gestiamo il caso
  const visibleBordersCount = guesses.length;
  const revealedBorders = targetCountry.borders.slice(0, visibleBordersCount);

  return (
    <div className="max-w-md mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Indovina lo Stato</h2>
        <p className="text-slate-500">Usa i confini sbloccati come indizio.</p>
      </div>

      {/* Pannello Indizi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Confini Rilevati ({revealedBorders.length} / {targetCountry.borders.length})
        </h3>
        
        {targetCountry.borders.length === 0 ? (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-xl font-medium">
            🏝️ Questo stato è un'isola!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {revealedBorders.length > 0 ? (
              revealedBorders.map((code) => (
                <span key={code} className="px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200 animate-in fade-in zoom-in">
                  {getCountryNameByCode(code)}
                </span>
              ))
            ) : (
              <p className="text-slate-400 italic">Fai il primo tentativo per sbloccare un confine...</p>
            )}
          </div>
        )}
      </div>

      {/* Input di Gioco */}
      <SearchBar 
        onSelect={(country) => addGuess(country, targetCountry)} 
        disabled={status !== 'playing'} 
      />

      {/* Lista Tentativi Errati */}
      <div className="space-y-2">
        {guesses.map((guess, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
             <span>{guess.flagEmoji} {guess.name}</span>
             <span className="text-red-500 font-bold">✕</span>
          </div>
        ))}
      </div>
    </div>
  );
}