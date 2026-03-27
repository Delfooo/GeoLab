// src/components/game/CapitalistHint.tsx
import { getDistance, getDirection } from '../../lib/geography';
import { Country } from '../../types';

export function CapitalistHint({ guess, target }: { guess: Country, target: Country }) {
  const dist = getDistance(guess.latitude, guess.longitude, target.latitude, target.longitude);
  const dir = getDirection(guess.latitude, guess.longitude, target.latitude, target.longitude);

  return (
    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200 mb-2 animate-in slide-in-from-left">
      <span className="font-bold">{guess.name}</span>
      <div className="flex gap-4 text-sm font-mono">
        <span>{dist} km</span>
        <span>{dir}</span>
      </div>
    </div>
  );
}