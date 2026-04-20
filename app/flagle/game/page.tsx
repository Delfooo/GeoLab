'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FlagleMenu() {
  return (
    <main className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 pt-24 relative overflow-hidden">
      {/* Sfondo decorativo per dare profondità */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[100px]" />
      </div>

      <header className="text-center mb-12 relative z-10">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gold-gradient tracking-tighter mb-2">
          FLAGLE
        </h1>
        <p className="text-gold-500/60 font-bold uppercase tracking-widest text-sm">Seleziona Modalità</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
        <Link href="/flagle?mode=daily" className="group cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card p-10 rounded-[2.5rem] text-center border border-gold-500/20 group-hover:border-gold-500/50 transition-all shadow-2xl"
          >
            <span className="text-5xl mb-4 block">📅</span>
            <h2 className="text-2xl font-bold text-white mb-2">Giornaliera</h2>
            <p className="text-gold-100/50 text-sm">Sfida unica globale ogni 24 ore.</p>
            <div className="mt-6 text-gold-500 font-black text-xs uppercase tracking-widest">Gioca Ora →</div>
          </motion.div>
        </Link>

        <Link href="/flagle?mode=training" className="group cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card p-10 rounded-[2.5rem] text-center border border-gold-500/20 group-hover:border-gold-500/50 transition-all shadow-2xl"
          >
            <span className="text-5xl mb-4 block">🦾</span>
            <h2 className="text-2xl font-bold text-white mb-2">Allenamento</h2>
            <p className="text-gold-100/50 text-sm">Gioca all'infinito con nazioni casuali.</p>
            <div className="mt-6 text-gold-500 font-black text-xs uppercase tracking-widest">Inizia →</div>
          </motion.div>
        </Link>
      </div>
    </main>
  );
}
