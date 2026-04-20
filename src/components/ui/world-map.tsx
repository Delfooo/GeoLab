"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

export function WorldMap({ lineColor = "#EAB308" }) {
  // 1. I 6 punti geografici fissi
  const locations = [
    { lat: 41.8719, lng: 12.5674 },   // Roma
    { lat: 35.6895, lng: 139.6917 },  // Tokyo
    { lat: -33.8688, lng: 151.2093 }, // Sydney
    { lat: 19.4326, lng: -99.1332 },  // Città del Messico
    { lat: 40.7128, lng: -74.0060 },  // New York
    { lat: 51.5074, lng: -0.1278 },   // Londra
  ];

  // Stato per gestire quale segmento mostrare
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % locations.length);
    }, 3500); // Cambia punto ogni 3.5 secondi
    return () => clearInterval(interval);
  }, [locations.length]);

  const project = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 200 - (800 * mercN) / (2 * Math.PI);
    return { x, y };
  };

  const points = useMemo(() => locations.map(loc => project(loc.lat, loc.lng)), []);

  // Coordinate del segmento corrente
  const startPt = points[index];
  const endPt = points[(index + 1) % points.length];

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-dark-900 overflow-hidden">
      <svg viewBox="0 0 800 400" className="w-full h-full object-cover scale-150 opacity-60">
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#262626" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#dotPattern)" />

        {/* Linea singola animata: appare e scompare in base all'indice */}
        <AnimatePresence mode="wait">
          <motion.line
            key={index}
            x1={startPt.x} y1={startPt.y}
            x2={endPt.x} y2={endPt.y}
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Tutti i 6 punti sempre visibili nello sfondo */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="3" fill={lineColor} className="animate-pulse" />
            <circle cx={pt.x} cy={pt.y} r="8" fill={lineColor} className="opacity-20" />
          </g>
        ))}
      </svg>
      
      {/* Il Globo stilizzato visibile nello sfondo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
         <Globe size={600} className="text-gold-500" />
      </div>
    </div>
  );
}

export default WorldMap;