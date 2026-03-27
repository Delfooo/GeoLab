// src/lib/geography.ts

import countriesData from '../data/countries.json';

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raggio Terra in km
  const dLat = (lat1 - lat2) * (Math.PI / 180);
  const dLon = (lon1 - lon2) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

export const getDirection = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const angle = (Math.atan2(lon2 - lon1, lat2 - lat1) * 180) / Math.PI;
  if (angle >= -22.5 && angle < 22.5) return '⬆️ N';
  if (angle >= 22.5 && angle < 67.5) return '↗️ NE';
  if (angle >= 67.5 && angle < 112.5) return '➡️ E';
  if (angle >= 112.5 && angle < 157.5) return '↘️ SE';
  if (angle >= 157.5 || angle < -157.5) return '⬇️ S';
  if (angle >= -157.5 && angle < -112.5) return '↙️ SO';
  if (angle >= -112.5 && angle < -67.5) return '⬅️ O';
  if (angle >= -67.5 && angle < -22.5) return '↖️ NO';
  return '';
};

export const getCountryNameByCode = (code: string): string => {
  const country = countriesData.find(c => c.code === code);
  return country ? `${country.flagEmoji} ${country.name}` : code;
};