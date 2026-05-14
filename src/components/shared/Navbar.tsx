'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, ChevronDown, Trophy, HelpCircle } from 'lucide-react';
import { useGameModeStore } from '../../store/useGameModeStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Recuperiamo il mode corrente per generare i link corretti
  const mode = useGameModeStore((state) => state.mode);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lista giochi completa
  const gameLinks = [
    { name: 'Flagle', href: `/${mounted ? mode : 'daily'}/flagle`, desc: 'Indovina la bandiera' },
    { name: 'Capitalle', href: `/${mounted ? mode : 'daily'}/capitale`, desc: 'Sfida sulle capitali' },
    { name: 'Borderle', href: `/${mounted ? mode : 'daily'}/bordle`, desc: 'Riconosci i vicini' },
    { name: 'Coastline', href: `/${mounted ? mode : 'daily'}/coastline`, desc: 'L\'ombra della costa' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 ${
        isScrolled ? 'bg-dark-900/95 backdrop-blur-xl border-b border-gold-500/20 shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="bg-gold-500 rounded-lg p-1.5 group-hover:rotate-[360deg] transition-transform duration-700">
              <span className="text-xl">🌍</span>
            </div>
            <span className="text-2xl font-black text-gold-500 tracking-tighter">GEOLAB</span>
          </Link>

          {/* CONTROLLI CENTRO/DESTRA */}
          <div className="flex items-center gap-2 md:gap-6">

            {/* DROPDOWN GIOCHI (Desktop) */}
            <div className="hidden md:relative md:block">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/20 text-gold-100/80 hover:border-gold-500/50 hover:text-gold-500 transition-all font-bold text-xs uppercase tracking-widest"
              >
                Giochi
                <ChevronDown className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-64 glass-card border border-gold-500/30 rounded-3xl p-2 shadow-2xl"
                  >
                    {gameLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block p-3 rounded-2xl hover:bg-gold-500/10 transition-colors group"
                      >
                        <div className="text-gold-500 font-bold text-sm uppercase group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </div>
                        <div className="text-gold-100/40 text-[10px] uppercase tracking-tighter mt-0.5">{link.desc}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CLASSIFICA (Spostata fuori dal menu) */}
            <Link 
              href="/leaderboard" 
              className="hidden md:flex items-center gap-2 text-gold-100/60 hover:text-gold-500 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <Trophy size={16} />
              Classifica
            </Link>

            {/* PULSANTE HELP "?" */}
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="w-10 h-10 rounded-full border border-gold-500/20 flex items-center justify-center text-gold-500 hover:bg-gold-500/10 hover:border-gold-500/50 transition-all"
            >
              <HelpCircle size={22} />
            </button>

            {/* PULSANTE PROFILO */}
            <Link href="/profile" className="relative group">
              <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 flex items-center justify-center bg-dark-800 group-hover:border-gold-500 transition-all overflow-hidden shadow-lg">
                <User className="w-6 h-6 text-gold-500" />
              </div>
            </Link>

            {/* MOBILE TOGGLE */}
            <button className="md:hidden text-gold-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div className="md:hidden bg-dark-900 border-t border-gold-500/20 mt-4 p-4 space-y-2">
              <Link href="/leaderboard" className="block p-4 text-gold-500 font-black uppercase">🏆 Classifica</Link>
              {gameLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="block p-4 text-gold-100/60 uppercase text-sm">
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* POP-UP "COME SI GIOCA" */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-lg w-full p-8 rounded-[3rem] border-gold-500/50 relative shadow-[0_0_50px_rgba(0,0,0,1)]"
            >
              <button onClick={() => setIsHelpOpen(false)} className="absolute top-6 right-6 text-gold-500/50 hover:text-gold-500 transition-colors">
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black text-gold-500 mb-6 uppercase tracking-tighter italic">Manuale Esploratore</h2>
              
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="text-gold-100 font-black uppercase mb-1">🚩 Flagle</h3>
                  <p className="text-gold-100/50">Indovina il paese dalla bandiera. Colori comuni svelano pezzi del puzzle.</p>
                </div>
                <div>
                  <h3 className="text-gold-100 font-black uppercase mb-1">🏛️ Capitalle</h3>
                  <p className="text-gold-100/50">Trova lo stato partendo dalla capitale. Usa bussola e distanza per orientarti.</p>
                </div>
                <div>
                  <h3 className="text-gold-100 font-black uppercase mb-1">🗺️ Borderle</h3>
                  <p className="text-gold-100/50">Riconosci lo stato dai suoi vicini. Più sbagli, più confini vengono rivelati.</p>
                </div>
                <div>
                  <h3 className="text-gold-100 font-black uppercase mb-1">🏝️ Coastline</h3>
                  <p className="text-gold-100/50">La sfida definitiva. Identifica la nazione solo dalla sagoma della sua costa.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsHelpOpen(false)}
                className="btn-gold w-full mt-8 py-4 uppercase tracking-widest text-xs"
              >
                Pronto all'esplorazione
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}