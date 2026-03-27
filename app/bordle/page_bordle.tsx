import { getDailyCountry } from '../../src/lib/geography';
import targetCountry from '../../src/components/game/targetCountry';
import TargetCountry from '../../src/components/game/targetCountry';

export default function BorderlePage() {
  const target = getDailyCountry(); // Il paese del giorno

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <TargetCountry targetCountry={target} />
    </main>
  );
}