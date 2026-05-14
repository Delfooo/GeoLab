'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlagDisplayProps {
  countryCode: string;
  revealedSteps: number[];
  isGameOver: boolean;
  gridSize: number;
}

interface CountryDetails {
  name: string;
  capital: string;
  region: string;
  population: string;
  languages: string;
}

export default function FlagDisplay({ countryCode, revealedSteps, isGameOver, gridSize = 3}: FlagDisplayProps) {
  const [details, setDetails] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Recupero dati tramite Rest Countries API (Gratis)
  useEffect(() => {
    if (isGameOver && countryCode) {
      setLoading(true);
      fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then(res => res.json())
        .then(data => {
          const c = data[0];
          setDetails({
            name: c.translations.ita?.common || c.name.common,
            capital: c.capital?.[0] || 'N/A',
            region: c.region,
            population: new Intl.NumberFormat('it-IT').format(c.population),
            languages: Object.values(c.languages || {}).join(', ')
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Errore API:", err);
          setLoading(false);
        });
    } else {
      setDetails(null); // Reset quando inizia una nuova partita
    }
  }, [isGameOver, countryCode]);

  const flagUrl = `https://flagcdn.com/w640/${countryCode.toLowerCase()}.png`;
  const gridDimension = Math.sqrt(gridSize);

  return (
    <div className="flex flex-col items-center w-full gap-6">
      {/* Contenitore Bandiera */}
      <div className="relative w-full max-w-sm aspect-[3/2] bg-dark-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/20">
        <img src={flagUrl} alt="Flag" className="w-full h-full object-cover" />
        
        {/* Griglia di copertura */}
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${gridDimension}, 1fr)`,
            gridTemplateRows: `repeat(${gridDimension}, 1fr)` 
          }}
        >
          {Array.from({ length: gridSize }).map((_, i) => (
            <div
              key={i}
              className={`bg-dark-900 transition-all duration-700 border-[0.5px] border-white/5 ${
                isGameOver || revealedSteps.includes(i) ? 'opacity-0' : 'opacity-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pannello Dati Stato (mostrato solo a fine gioco) */}
      <AnimatePresence>
        {isGameOver && details && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gold-500/5 border border-gold-500/20 rounded-2xl p-4 space-y-3"
          >
            <div className="text-center border-b border-gold-500/10 pb-2">
              <h3 className="text-2xl font-black text-gold-500 uppercase tracking-tighter">
                {details.name}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-gold-100/60">
              <div>
                <p className="text-gold-500/40">Capitale</p>
                <p className="text-white">{details.capital}</p>
              </div>
              <div>
                <p className="text-gold-500/40">Regione</p>
                <p className="text-white">{details.region}</p>
              </div>
              <div>
                <p className="text-gold-500/40">Popolazione</p>
                <p className="text-white">{details.population}</p>
              </div>
              <div>
                <p className="text-gold-500/40">Lingue</p>
                <p className="text-white truncate">{details.languages}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}