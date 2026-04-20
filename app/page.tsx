'use client';

import Link from 'next/link';
import { WorldMap } from "../src/components/ui/world-map";
import { motion } from "framer-motion";

const GIOCHI = [
  { id: 'flagle', title: '🚩 Flagle', description: 'Indovina la bandiera.', available: true },
  { id: 'capitalle', title: '🏛️ Capitalle', description: 'Trova lo stato dalla capitale.', available: false },
  { id: 'borderle', title: '🗺️ Borderle', description: 'Riconosci i confini.', available: false },
  { id: 'coastline', title: '🏝️ Coastline', description: 'Riconosci la forma.', available: true },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-dark-900">
      
      {/* BACKGROUND LAYER: Mappa del mondo a tutto schermo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <WorldMap lineColor="#EAB308" />
        {/* Overlay scuro per leggibilità */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* CONTENT LAYER: UI centrale */}
      <div className="relative z-10 w-full max-w-6xl px-8 py-20 flex flex-col items-center">
        <header className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gold-gradient"
          >
            GEOLAB
          </motion.h1>
          <p className="text-gold-500 font-medium tracking-[0.5em] uppercase text-sm">
            oltre i confini
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {GIOCHI.map((gioco, idx) => (
            <motion.div 
              key={gioco.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="glass-card p-10 rounded-[2rem] group relative overflow-hidden text-center flex flex-col"
            >
              <h2 className="text-3xl font-bold text-white mb-4">{gioco.title}</h2>
              <p className="text-gold-100/60 text-base mb-8 flex-grow">{gioco.description}</p>
              
              {gioco.available ? (
                /* Un unico Link dinamico per ogni gioco */
                <Link 
                  href={gioco.id === 'flagle' ? '/flagle/game' : 
                    gioco.id === 'borderle' ? '/borderle' : 
                    gioco.id === 'capitalle' ? '/capitalle' : 
                    gioco.id === 'coastline' ? '/coastline' : `/${gioco.id}`} 
                  className="btn-gold w-full block py-4 text-lg"
                >
                  INIZIA SFIDA
                </Link>
              ) : (
                <div className="py-4 px-4 rounded-xl bg-white/5 border border-white/10 text-white/20 font-bold">
                  PROSSIMAMENTE
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}