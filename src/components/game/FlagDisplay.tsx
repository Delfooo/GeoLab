'use client';

interface FlagDisplayProps {
  countryCode: string; // Es: "IT"
  step: number;        // Numero di tentativi effettuati
  totalSteps: number;  // Massimo 6 tentativi
}

export default function FlagDisplay({ countryCode, step, totalSteps }: FlagDisplayProps) {
  // Generiamo una griglia di 6 pezzi (3 colonne x 2 righe)
  const pieces = Array.from({ length: totalSteps });
  const flagUrl = `https://flagcdn.com/w640/${countryCode.toLowerCase()}.jpg`;

  return (
    <div className="relative w-full max-w-sm aspect-[3/2] bg-slate-200 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
      {/* Immagine della bandiera */}
      <img 
        src={flagUrl} 
        alt="Country Flag" 
        className="w-full h-full object-cover"
      />

      {/* Griglia di copertura (Overlay) */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {pieces.map((_, i) => (
          <div
            key={i}
            className={`bg-slate-800 transition-opacity duration-500 border-[0.5px] border-slate-700 ${
              i < step ? 'opacity-0' : 'opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
}