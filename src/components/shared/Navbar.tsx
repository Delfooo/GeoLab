'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Flagle', href: '/flagle', desc: 'Indovina la bandiera' },
    { name: 'Capitalle', href: '/capitalle', desc: 'Sfida sulle capitali' },
    { name: 'Borderle', href: '/borderle', desc: 'Riconosci i confini' },
    { name: 'Classifica', href: '/leaderboard', desc: 'I migliori esploratori' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 ${
      isScrolled ? 'bg-dark-900/90 backdrop-blur-xl border-b border-gold-500/20 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO - Unico punto per tornare alla Home */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-gold-500 rounded-lg p-1.5 group-hover:rotate-12 transition-transform duration-300">
            <span className="text-xl">🌍</span>
          </div>
          <span className="text-2xl font-black text-gold-500 tracking-tighter">
            GEOLAB
          </span>
        </Link>

        {/* CONTROLLI DESTRA */}
        <div className="flex items-center gap-4">
          
          {/* MENU A COMPARSA (Desktop) */}
          <div className="hidden md:relative md:block">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/20 text-gold-100/80 hover:border-gold-500/50 hover:text-gold-500 transition-all font-bold text-sm uppercase tracking-widest"
            >
              Esplora Giochi
              <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 glass-card border border-gold-500/30 rounded-[1.5rem] p-2 shadow-2xl backdrop-blur-2xl"
                >
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block p-3 rounded-xl hover:bg-gold-500/10 transition-colors group"
                    >
                      <div className="text-gold-500 font-bold text-sm uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </div>
                      <div className="text-gold-100/40 text-xs mt-0.5">{link.desc}</div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PULSANTE PROFILO ROTONDO */}
          <Link href="/profile" className="relative group">
            <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 flex items-center justify-center bg-dark-800 group-hover:border-gold-500 transition-all overflow-hidden shadow-lg group-hover:shadow-gold-500/20">
              <User className="w-6 h-6 text-gold-500 group-hover:scale-110 transition-transform" />
            </div>
            {/* Tooltip opzionale */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gold-500 text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none">
              Profilo
            </span>
          </Link>

          {/* MENU MOBILE (Icona Hamburger) */}
          <button 
            className="md:hidden text-gold-500 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN FULLSCREEN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-dark-900/95 backdrop-blur-xl mt-4 rounded-2xl border border-gold-500/20"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-4 text-gold-100 font-bold uppercase tracking-widest border-b border-white/5 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}