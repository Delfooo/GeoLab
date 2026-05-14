'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Crown, Search, ArrowUpRight } from 'lucide-react';

// Dati simulati degli utenti
const MOCK_LEADERS = [
  { id: 1, name: 'MarcoGeo', victories: 452, streak: 12, rank: 'Leggenda', avatar: '🦁' },
  { id: 2, name: 'ElenaExplorer', victories: 389, streak: 8, rank: 'Veterano', avatar: '🦊' },
  { id: 3, name: 'GeoMaster99', victories: 312, streak: 5, rank: 'Veterano', avatar: '🦅' },
  { id: 4, name: 'SofiaWorld', victories: 285, streak: 15, rank: 'Esperto', avatar: '🐼' },
  { id: 5, name: 'LucaBorders', victories: 210, streak: 3, rank: 'Esperto', avatar: '🐨' },
  { id: 6, name: 'SaraMap', victories: 195, streak: 7, rank: 'Esploratore', avatar: '🐱' },
  { id: 7, name: 'DavideFlags', victories: 150, streak: 2, rank: 'Esploratore', avatar: '🐺' },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'victories' | 'streak'>('victories');

  return (
    <main className="min-h-screen bg-dark-900 pt-24 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* HEADER CLASSIFICA */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 bg-gold-500/10 rounded-full mb-4 border border-gold-500/20"
          >
            <Trophy size={40} className="text-gold-500" />
          </motion.div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gold-gradient tracking-tighter uppercase mb-2">
            Leaderboard
          </h1>
          <p className="text-gold-100/40 font-bold uppercase text-xs tracking-[0.3em]">
            I migliori esploratori del mondo
          </p>
        </header>

        {/* FILTRI DI SELEZIONE */}
        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => setFilter('victories')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === 'victories' ? 'bg-gold-500 text-dark-900 shadow-lg shadow-gold-500/20' : 'bg-dark-800 text-gold-500/50 border border-gold-500/10'
            }`}
          >
            Vittorie Totali
          </button>
          <button 
            onClick={() => setFilter('streak')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === 'streak' ? 'bg-gold-500 text-dark-900 shadow-lg shadow-gold-500/20' : 'bg-dark-800 text-gold-500/50 border border-gold-500/10'
            }`}
          >
            Miglior Streak
          </button>
        </div>

        {/* TOP 3 PODIO (Visuale) */}
        <div className="grid grid-cols-3 gap-4 mb-12 items-end">
          {/* SECONDO POSTO */}
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2 text-slate-400 font-black italic">#2</div>
            <div className="w-20 h-20 rounded-full border-4 border-slate-400/30 bg-dark-800 flex items-center justify-center text-3xl mb-2 relative">
              {MOCK_LEADERS[1].avatar}
            </div>
            <div className="h-24 w-full bg-dark-800/50 border-t-2 border-slate-400/50 rounded-t-2xl flex flex-col items-center justify-center p-2">
              <span className="text-white font-bold text-xs truncate w-full text-center">{MOCK_LEADERS[1].name}</span>
              <span className="text-gold-500 font-black">{MOCK_LEADERS[1].victories}V</span>
            </div>
          </div>

          {/* PRIMO POSTO */}
          <div className="flex flex-col items-center">
            <Crown className="text-gold-500 mb-2 animate-bounce" size={32} />
            <div className="w-28 h-28 rounded-full border-4 border-gold-500 bg-dark-800 flex items-center justify-center text-5xl mb-2 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              {MOCK_LEADERS[0].avatar}
            </div>
            <div className="h-32 w-full bg-gold-gradient rounded-t-3xl flex flex-col items-center justify-center p-2 shadow-2xl">
              <span className="text-dark-900 font-black text-sm uppercase">{MOCK_LEADERS[0].name}</span>
              <span className="text-dark-900/70 font-black text-xl">{MOCK_LEADERS[0].victories}V</span>
            </div>
          </div>

          {/* TERZO POSTO */}
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2 text-amber-700 font-black italic">#3</div>
            <div className="w-20 h-20 rounded-full border-4 border-amber-700/30 bg-dark-800 flex items-center justify-center text-3xl mb-2 relative">
              {MOCK_LEADERS[2].avatar}
            </div>
            <div className="h-20 w-full bg-dark-800/50 border-t-2 border-amber-700/50 rounded-t-2xl flex flex-col items-center justify-center p-2">
              <span className="text-white font-bold text-xs truncate w-full text-center">{MOCK_LEADERS[2].name}</span>
              <span className="text-gold-500 font-black">{MOCK_LEADERS[2].victories}V</span>
            </div>
          </div>
        </div>

        {/* LISTA COMPLETA */}
        <section className="bg-dark-800/30 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-gold-500 font-black uppercase text-xs tracking-widest">Tutti i Partecipanti</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500/30" size={14} />
              <input 
                type="text" 
                placeholder="Cerca utente..." 
                className="bg-dark-900/50 border border-gold-500/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500/50 transition-all"
              />
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {MOCK_LEADERS.map((user, index) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 text-gold-500/30 font-black italic">#{index + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-xl border border-white/5 group-hover:border-gold-500/30 transition-all">
                    {user.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight">{user.name}</h4>
                    <span className="text-[10px] text-gold-500/50 font-black uppercase">{user.rank}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-white font-black text-sm">{user.victories}</p>
                    <p className="text-[9px] text-gold-100/30 font-bold uppercase tracking-tighter">Vittorie</p>
                  </div>
                  <div className="text-right w-16">
                    <p className="text-orange-500 font-black text-sm flex items-center justify-end gap-1">
                      {user.streak} <Star size={10} fill="currentColor" />
                    </p>
                    <p className="text-[9px] text-gold-100/30 font-bold uppercase tracking-tighter">Streak</p>
                  </div>
                  <ArrowUpRight className="text-gold-500/10 group-hover:text-gold-500 transition-colors" size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}