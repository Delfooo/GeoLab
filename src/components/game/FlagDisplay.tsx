// FlagDisplay.tsx
// Componente per visualizzare la bandera del paese e la griglia di copertura

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FlagDisplayProps {
  countryCode: string;
  step: number;
  totalSteps: number;
}

export default function FlagDisplay({ countryCode, step, totalSteps }: FlagDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pieces = Array.from({ length: totalSteps });
  
  // Utilizziamo la variabile d'ambiente o il fallback
  const baseUrl = process.env.NEXT_PUBLIC_FLAG_CDN || 'https://flagcdn.com/w640';
  const flagUrl = `${baseUrl}/${countryCode.toLowerCase()}.jpg`;

  // Resetta lo spinner se cambia il paese (es. nuova partita)
  useEffect(() => {
    setIsLoading(true);
  }, [countryCode]);

  return (
    <div className="relative w-full max-w-sm aspect-[3/2] bg-slate-200 rounded-lg overflow-hidden shadow-2xl border-4 border-white mx-auto">
      
      {/* Skeleton Loader - visibile finché l'immagine non è pronta */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-300 animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Immagine con ottimizzazione standard HTML5 o Next Image */}
      <img 
        src={flagUrl} 
        alt="Country Flag" 
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
      />

      {/* Griglia di copertura (Overlay) - Logica del Gioco */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 pointer-events-none">
        {pieces.map((_, i) => (
          <div
            key={i}
            className={`bg-slate-900 transition-all duration-700 ease-in-out border-[0.5px] border-slate-700/30 ${
              i < step ? 'opacity-0 scale-110' : 'opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
}