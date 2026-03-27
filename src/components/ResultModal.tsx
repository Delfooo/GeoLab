// ResultModal.tsx
// Componente per visualizzare i risultati del gioco

'use client';

import { useState, useEffect } from 'react';
import { Country, GameStatus } from '../types';
import { X, Trophy, AlertCircle, Loader2, Globe, Users, Landmark } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  status: GameStatus;
  targetCountry: Country;
  onClose: () => void;
}

export default function ResultModal({ isOpen, status, targetCountry, onClose }: ResultModalProps) {
  const [extraData, setExtraData] = useState<{ extract: string; thumbnail?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Chiamata al proxy API che abbiamo definito nel punto 2
      fetch(`/api/country-info?name=${encodeURIComponent(targetCountry.name)}`)
        .then((res) => res.json())
        .then((data) => {
          setExtraData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, targetCountry]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header con Colore Dinamico */}
        <div className={`p-6 text-center text-white ${status === 'won' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="w-8" /> {/* Spacer */}
            {status === 'won' ? <Trophy size={48} className="mx-auto" /> : <AlertCircle size={48} className="mx-auto" />}
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {status === 'won' ? 'Vittoria!' : 'Peccato...'}
          </h2>
          <p className="opacity-90 font-medium">Il paese era: {targetCountry.name}</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
              <p className="text-slate-400 text-sm">Recupero curiosità...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info Rapide */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Landmark size={18} className="text-blue-500" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Capitale</p>
                    <p className="text-sm font-semibold">{targetCountry.capital}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Users size={18} className="text-emerald-500" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Abitanti</p>
                    <p className="text-sm font-semibold">{(targetCountry.population / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>

              {/* Descrizione Extra (Wikipedia) */}
              {extraData?.extract && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1 flex items-center gap-1">
                    <Globe size={12} /> Sapevi che...
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{extraData.extract.substring(0, 180)}..."
                  </p>
                </div>
              )}

              <button 
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
              >
                Gioca Ancora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}