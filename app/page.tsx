'use client';

import Link from 'next/link';
import { WorldMap } from "../src/components/ui/world-map";
import { motion } from "framer-motion";
import { useGameModeStore } from '../src/store/useGameModeStore'; // Importa lo store dal file di configurazione
import { CloudSun, Dumbbell } from 'lucide-react'; // Icone per le modalità
import { useState, useEffect } from 'react';

const GIOCHI = [
  { id: 'flagle', title: '🚩 Flagle', description: 'Indovina la bandiera.', available: true },
  { id: 'capitale', title: '🏛️ Capitalle', description: 'Trova lo stato dalla capitale.', available: true },
  { id: 'bordle', title: '🗺️ Borderle', description: 'Riconosci i confini.', available: true },
  { id: 'coastline', title: '🏝️ Coastline', description: 'Riconosci la forma.', available: true },
];

export default function HomePage() {
  const { mode, toggleMode } = useGameModeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("HomePage mounted");
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-dark-900">
      
      {/* BACKGROUND LAYER - Sempre visibile */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full opacity-90">
          <WorldMap />
          <div className="absolute inset-0 bg-radial-dark" />
        </div>
      </div>

      {/* DEBUG ELEMENT - Sempre visibile se montato */}
      {!mounted && (
        <div className="fixed top-0 left-0 z-[200] bg-red-500 text-white p-2 text-xs">
          Hydrating...
        </div>
      )}

      {/* CONTENT LAYER */}
      <div className={`relative z-10 w-full max-w-6xl px-8 py-20 flex flex-col items-center transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gold-gradient drop-shadow-2xl">
            GEOLAB
          </h1>
          
          {/* SWITCHER MODALITÀ */}
          {mounted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-6"
            >
              <div className="bg-dark-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-gold-500/20 flex gap-1 shadow-2xl">
                <button
                  onClick={() => toggleMode('daily')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    mode === 'daily' 
                      ? 'bg-gold-500 text-dark-900 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                      : 'text-gold-500/40 hover:text-gold-500'
                  }`}
                >
                  <CloudSun size={16} /> Daily
                </button>
                <button
                  onClick={() => toggleMode('training')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    mode === 'training' 
                      ? 'bg-gold-500 text-dark-900 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                      : 'text-gold-500/40 hover:text-gold-500'
                  }`}
                >
                  <Dumbbell size={16} /> Training
                </button>
              </div>
            </motion.div>
          )}
        </header>

        {/* Griglia Giochi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {GIOCHI.map((gioco, idx) => (
            <div 
              key={gioco.id}
              className="glass-card p-8 rounded-[2rem] group relative overflow-hidden text-center flex flex-col border border-white/5 hover:border-gold-500/30 transition-all shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{gioco.title}</h2>
              <p className="text-gold-100/60 text-sm mb-8 flex-grow leading-relaxed">
                {gioco.description}
              </p>
              
              {gioco.available ? (
                <Link 
                  href={mounted ? `/${mode}/${gioco.id}` : '#'}
                  className="btn-gold w-full block py-3.5 text-base font-black tracking-widest shadow-lg"
                >
                  GIOCA {mounted && mode === 'daily' ? 'DAILY' : 'TRAINING'}
                </Link>
              ) : (
                <div className="py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/20 font-bold uppercase text-[10px] tracking-widest">
                  PROSSIMAMENTE
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}