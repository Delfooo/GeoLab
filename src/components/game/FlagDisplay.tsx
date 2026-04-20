'use client';

interface FlagDisplayProps {
  countryCode: string;
  revealedSteps: number[]; // Array di indici dei tasselli da mostrare
  isGameOver: boolean;
}

export default function FlagDisplay({ countryCode, revealedSteps, isGameOver }: FlagDisplayProps) {
  const flagUrl = `https://flagcdn.com/w640/${countryCode.toLowerCase()}.jpg`;
  const totalPieces = 6;

  return (
    <div className="relative w-full max-w-sm aspect-[3/2] bg-slate-900 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
      {/* Immagine della bandiera sempre presente sotto */}
      <img 
        src={flagUrl} 
        alt="Target" 
        className="w-full h-full object-cover"
      />

      {/* Griglia di copertura */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {Array.from({ length: totalPieces }).map((_, i) => {
          // Un tassello è visibile (nero) se il gioco non è finito 
          // E se quel tassello non è stato ancora "rivelato"
          const isRevealed = isGameOver || revealedSteps.includes(i);
          
          return (
            <div
              key={i}
              className={`bg-slate-900 transition-opacity duration-700 border-[0.5px] border-white/10 ${
                isRevealed ? 'opacity-0' : 'opacity-100'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}