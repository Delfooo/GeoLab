'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

//Replace interface with type
type CoastlineDisplayProps = {
  countryCode: string; // Es: "IT", "FR"
}

export default function CoastlineDisplay({ countryCode }: CoastlineDisplayProps) {
  if (!countryCode) return null;
  const [error, setError] = useState<boolean>(false);
  const [svgPath, setSvgPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Usiamo una CDN affidabile per recuperare i dati geografici in formato SVG
    // Nota: countryCode deve essere minuscolo per questa API
    const code = countryCode.toLowerCase();
    
    fetch(`https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@master/svg/${code}.svg`)
      .then(res => res.text())
      .then(data => {
        // Estraiamo solo i path per creare una versione "silhouette"
        // In alternativa, carichiamo l'intero SVG e forziamo il colore oro via CSS
        setSvgPath(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [countryCode]);

  return (
    <div className="relative w-full max-w-sm aspect-square glass-card rounded-3xl flex items-center justify-center p-8 mx-auto overflow-hidden">
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-lg font-bold"
          >
            Error loading country flag
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"
          />
        ) : (
          <motion.div
            key="shape"
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-full h-full flex items-center justify-center coastline-container"
            dangerouslySetInnerHTML={{ __html: svgPath || '' }}
            style={{
              // Questa magia CSS trasforma qualsiasi SVG (anche colorato) in una sagoma Oro
              filter: 'brightness(0) saturate(100%) invert(79%) sepia(58%) saturate(1031%) hue-rotate(3deg) brightness(108%) contrast(101%)'
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Overlay di riflesso per dare un effetto metallico */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}