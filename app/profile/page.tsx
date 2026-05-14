'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Map, Settings, RotateCw, Check, Award, Globe } from 'lucide-react';
import Link from 'next/link';
import { useStatsStore } from '../../src/store/useStatsStore';

export default function ProfilePage() {
  const { 
    username, 
    avatarSeed, 
    global, 
    games, 
    updateUsername, 
    updateAvatar 
  } = useStatsStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(username);
  const [feedback, setFeedback] = useState<{msg: string, error: boolean} | null>(null);

  // URL Avatar Dinamico (DiceBear)
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleSaveName = () => {
    const res = updateUsername(newName);
    setFeedback({ msg: res.message, error: !res.success });
    if (res.success) {
      setTimeout(() => {
        setIsEditing(false);
        setFeedback(null);
      }, 1500);
    }
  };

  const winRate = global.gamesPlayed > 0 
    ? Math.round((global.victories / global.gamesPlayed) * 100) 
    : 0;

  const getUserRank = (vittorie: number) => {
    if (vittorie >= 100) return "Leggenda Mondiale";
    if (vittorie >= 50) return "Veterano del Mondo";
    if (vittorie >= 10) return "Esploratore Esperto";
    return "Apprendista Geografo";
  };

  const UI_STATS = [
    { label: 'Partite Totali', value: global.gamesPlayed, icon: Target, color: 'text-blue-400' },
    { label: 'Vittorie', value: global.victories, icon: Trophy, color: 'text-gold-500' },
    { label: 'Win Rate', value: `${winRate}%`, icon: Map, color: 'text-green-400' },
    { label: 'Streak Attuale', value: global.currentStreak, icon: Flame, color: 'text-orange-500' },
  ];

  return (
    <main className="min-h-screen bg-dark-900 pt-24 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* HEADER PROFILO */}
        <header className="flex flex-col md:flex-row items-center gap-8 bg-dark-800/50 p-10 rounded-[3rem] border border-gold-500/10 shadow-2xl relative overflow-hidden">
          <div className="relative group">
            <div className="w-36 h-36 rounded-full border-4 border-gold-500/20 flex items-center justify-center bg-dark-700 shadow-2xl overflow-hidden">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={updateAvatar}
              className="absolute -bottom-2 -right-2 bg-gold-500 text-dark-900 p-2.5 rounded-full shadow-lg hover:rotate-180 transition-transform duration-500"
            >
              <RotateCw size={18} />
            </button>
          </div>

          <div className="text-center md:text-left flex-1 space-y-2">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-center md:justify-start">
                  <input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={20}
                    className="bg-dark-900 border-2 border-gold-500/50 rounded-xl px-4 py-1 text-xl font-black text-white outline-none w-full max-w-[200px]"
                  />
                  <button onClick={handleSaveName} className="bg-gold-500 p-2 rounded-xl text-dark-900"><Check size={20}/></button>
                </div>
                {feedback && <p className={`text-[10px] font-bold uppercase ${feedback.error ? 'text-red-400' : 'text-green-400'}`}>{feedback.msg}</p>}
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{username}</h1>
                <button onClick={() => setIsEditing(true)} className="text-gold-500/30 hover:text-gold-500 transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            )}
            <p className="text-gold-500/50 font-bold uppercase text-xs tracking-[0.2em]">Grado: {getUserRank(global.victories)}</p>
            <div className="flex gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gold-100/40 uppercase border border-white/5">
                Ultimo accesso: {global.lastPlayed || 'Oggi'}
              </span>
            </div>
          </div>
        </header>

        {/* GRIGLIA STATISTICHE GLOBALI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {UI_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-dark-800/80 p-6 rounded-[2rem] border border-gold-500/5 flex flex-col items-center text-center shadow-xl"
            >
              <stat.icon className={`${stat.color} mb-3`} size={24} />
              <span className="text-2xl font-black text-white mb-1">{stat.value}</span>
              <span className="text-[10px] font-bold text-gold-100/30 uppercase tracking-widest">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* SEZIONE SKILL RADAR E OBIETTIVI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SKILL RADAR RIPRISTINATO */}
          <section className="bg-dark-800/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
            <h3 className="text-gold-500 font-black uppercase text-[10px] mb-6 tracking-widest text-center">Skill Radar</h3>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 border border-white/5 rounded-full" />
              <div className="absolute inset-4 border border-white/5 rounded-full" />
              <div className="absolute inset-8 border border-white/5 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="text-gold-500/10" size={80} />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-bold uppercase text-gold-100/40 w-full">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Memoria</span>
              <span className="text-gold-500">{Math.min((games.flagle?.victories || 0) * 10, 100)}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Posizione</span>
              {/* Verifica se nel tuo store è "capitale" o "capitalle" */}
              <span className="text-gold-500">{Math.min((games.capitale?.victories || 0) * 10, 100)}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Politica</span>
              <span className="text-gold-500">{Math.min((games.bordle?.victories || 0) * 10, 100)}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Analisi</span>
              <span className="text-gold-500">{Math.min((games.coastline?.victories || 0) * 10, 100)}%</span>
            </div>
          </div>
          </section>

          {/* OBIETTIVI */}
          <section className="md:col-span-2 bg-dark-800/40 p-6 rounded-[2.5rem] border border-white/5">
            <h3 className="text-gold-500 font-black uppercase text-[10px] mb-4 tracking-widest">Obiettivi sbloccati</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: '10v', icon: Trophy, label: '10 Vittorie', active: global.victories >= 10 },
                { id: '5s', icon: Flame, label: '5 Streak', active: global.bestStreak >= 5 },
                { id: 'all', icon: Globe, label: 'Esploratore', active: global.gamesPlayed >= 1 },
                { id: 'pro', icon: Award, label: 'Master', active: global.victories >= 50 },
              ].map((badge) => (
                <div 
                  key={badge.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                    badge.active ? 'border-gold-500/50 bg-gold-500/10 text-gold-500 shadow-lg' : 'border-white/5 bg-white/5 text-white/10 grayscale'
                  }`}
                >
                  <badge.icon size={14} />
                  <span className="text-[10px] font-bold uppercase">{badge.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* DETTAGLIO GIOCHI CON BARRE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-dark-800/40 p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-gold-500 font-black uppercase text-sm mb-6 tracking-widest">Prestazioni Giochi</h3>
            <div className="space-y-6">
              {Object.entries(games).map(([key, data]) => (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-gold-100 font-bold text-xs uppercase italic">{key}</span>
                    <span className="text-gold-500 text-[10px] font-black uppercase">{data.victories}V / {data.gamesPlayed}P</span>
                  </div>
                  <div className="h-1.5 w-full bg-dark-700 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.gamesPlayed > 0 ? (data.victories / data.gamesPlayed) * 100 : 0}%` }}
                      className="h-full bg-gold-gradient"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-dark-800/40 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center items-center text-center">
             <Link href="/" className="group flex flex-col items-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🌎</div>
                <p className="text-gold-100/40 text-xs font-medium italic mb-6">"Ogni confine superato è una nuova scoperta."</p>
                <div className="btn-gold px-8 py-3 text-[10px] font-black uppercase tracking-widest">Torna ai giochi</div>
             </Link>
          </section>
        </div>
      </div>
    </main>
  );
}