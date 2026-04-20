'use client';

import { Country, GameStatus } from '@/src/types/index';
import { X, Share2, Trophy, Frown } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  status: GameStatus;
  targetCountry?: Country | null;
  onClose: () => void;
  guessesCount: number;
}

export default function ResultModal({ isOpen, status, targetCountry, onClose, guessesCount }: ResultModalProps) {
  if (!isOpen || !targetCountry) return null;

  const handleShare = () => {
    const text = `GeoLab - Flagle 🚩\nTentativi: ${status === 'won' ? guessesCount : 'X'}/6\nhttps://geolab.com`;
    navigator.clipboard.writeText(text);
    alert('Risultato copiato negli appunti! 📋');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Pulsante Chiusura */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          {status === 'won' ? (
            <>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Ottimo lavoro!</h2>
              <p className="text-slate-500 mt-2">Hai indovinato in {guessesCount} tentativi.</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frown size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Peccato!</h2>
              <p className="text-slate-500 mt-2">Il paese misterioso era:</p>
            </>
          )}

          {/* Dettaglio Paese */}
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center gap-4">
            <span className="text-4xl">{targetCountry.flagEmoji}</span>
            <div className="text-left">
              <p className="font-bold text-slate-800 leading-none">{targetCountry.name}</p>
              <p className="text-sm text-slate-500">{targetCountry.capital}</p>
            </div>
          </div>

          {/* Statistiche Quick (Placeholder) */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-xs text-slate-400 uppercase font-bold">Streak</p>
              <p className="text-xl font-black text-slate-700">1</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-xs text-slate-400 uppercase font-bold">Vinte</p>
              <p className="text-xl font-black text-slate-700">100%</p>
            </div>
          </div>

          {/* Azioni */}
          <div className="mt-8 space-y-3">
            <button 
              onClick={handleShare}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
              <Share2 size={20} />
              CONDIVIDI RISULTATO
            </button>
            <p className="text-xs text-slate-400">Torna domani per una nuova sfida!</p>
          </div>
        </div>
      </div>
    </div>
  );
}