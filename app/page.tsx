import Link from 'next/link';

const GIOCHI = [
  {
    id: 'flagle',
    title: '🚩 Flagle',
    description: 'Indovina la bandiera nel minor numero di tentativi.',
    color: 'bg-blue-500',
    available: true,
  },
  {
    id: 'capitalle',
    title: '🏛️ Capitalle',
    description: 'Trova lo stato partendo dalla sua capitale.',
    color: 'bg-green-500',
    available: false, // Lo attiveremo dopo
  },
  {
    id: 'borderle',
    title: '🗺️ Borderle',
    description: 'Riconosci lo stato dai suoi confini.',
    color: 'bg-purple-500',
    available: false,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">GeoLab</h1>
          <p className="text-slate-600 italic">Il laboratorio dei piccoli geografi</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GIOCHI.map((gioco) => (
            <div 
              key={gioco.id}
              className={`p-6 rounded-2xl shadow-sm border border-slate-200 bg-white flex flex-col justify-between transition-transform hover:scale-105 ${!gioco.available && 'opacity-60'}`}
            >
              <div>
                <h2 className="text-xl font-bold mb-2">{gioco.title}</h2>
                <p className="text-slate-500 text-sm mb-4">{gioco.description}</p>
              </div>
              
              {gioco.available ? (
                <Link 
                  href={`/${gioco.id}`}
                  className={`w-full py-2 px-4 rounded-lg text-white font-semibold text-center ${gioco.color} hover:brightness-90`}
                >
                  Gioca Ora
                </Link>
              ) : (
                <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-200 text-slate-500 font-semibold cursor-not-allowed">
                  In Arrivo...
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}