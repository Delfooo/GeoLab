'use client';
import { useState, useEffect } from 'react';
import { Country } from '../../types';
import { usePopUpStore } from '../../store/usePopUpStore';
import { fetchCountries } from '../../lib/game-logic';

export default function PopUpGame() {
  const { score, updateScore } = usePopUpStore();
  const [countries, setCountries] = useState<Country[]>([]);
  const [leftCountry, setLeftCountry] = useState<Country | null>(null);
  const [rightCountry, setRightCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCountries();
      if (data.length >= 2) {
        setCountries(data);
        setLeftCountry(data[Math.floor(Math.random() * data.length)]);
        setRightCountry(data[Math.floor(Math.random() * data.length)]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleGuess = (higher: boolean) => {
    if (!leftCountry || !rightCountry || countries.length === 0) return;

    const isCorrect = higher 
      ? rightCountry.population >= leftCountry.population 
      : rightCountry.population <= leftCountry.population;

    if (isCorrect) {
      updateScore(true);
      // Il paese di destra diventa quello di sinistra, ne carichiamo uno nuovo a destra
      setLeftCountry(rightCountry);
      const filtered = countries.filter(c => c.code !== rightCountry.code);
      setRightCountry(filtered[Math.floor(Math.random() * filtered.length)]);
    } else {
      updateScore(false);
      alert(`Hai perso! Punteggio finale: ${score}`);
    }
  };

  if (loading || !leftCountry || !rightCountry) {
    return <div className="h-[70vh] flex items-center justify-center text-gold-500 font-bold uppercase">Caricamento PopUp Game...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[70vh] gap-4 p-4">
      {/* Paese di Sinistra (Riferimento) */}
      <div className="flex-1 bg-blue-600 text-white rounded-3xl flex flex-col items-center justify-center p-8 text-center">
        <span className="text-6xl mb-4">{leftCountry.flagEmoji}</span>
        <h2 className="text-3xl font-black uppercase">{leftCountry.name}</h2>
        <p className="text-xl mt-4 opacity-80 italic underline decoration-white/30">
          Ha {leftCountry.population.toLocaleString()} abitanti
        </p>
      </div>

      {/* Verso / VS Circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white text-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-bold shadow-xl border-4 border-slate-100">
        VS
      </div>

      {/* Paese di Destra (Input Utente) */}
      <div className="flex-1 bg-emerald-600 text-white rounded-3xl flex flex-col items-center justify-center p-8 text-center">
        <span className="text-6xl mb-4">{rightCountry.flagEmoji}</span>
        <h2 className="text-3xl font-black uppercase">{rightCountry.name}</h2>
        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={() => handleGuess(true)}
            className="bg-white text-emerald-700 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Più abitanti ▲
          </button>
          <button 
            onClick={() => handleGuess(false)}
            className="bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform border border-white/30"
          >
            Meno abitanti ▼
          </button>
        </div>
      </div>
    </div>
  );
}