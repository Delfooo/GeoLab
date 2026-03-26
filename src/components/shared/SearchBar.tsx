'use client';

import React, { useState, useEffect, useRef } from 'react';
import countriesData from '../../../src/data/countries.json';
import { Country } from '../../../src/types/index';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSelect: (country: Country) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSelect, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Chiudi la tendina se clicchi fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logica di filtraggio
  useEffect(() => {
    if (query.length > 1) {
      const filtered = countriesData.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.capital.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Mostriamo solo i primi 5 risultati
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="Digita il nome di un paese..."
          className="w-full p-4 pl-12 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-100"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {results.map((country) => (
            <li key={country.code}>
              <button
                onClick={() => {
                  onSelect(country);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <span>{country.flagEmoji}</span>
                <span className="font-medium text-slate-700">{country.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}