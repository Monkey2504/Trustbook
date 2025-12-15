import React, { useMemo, useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip, TooltipProps
} from 'recharts';
import { CHALLENGES, RADAR_DATA } from '../constants';
import { Category } from '../types';
import { AlertTriangle, Eye, Search, ArrowRight } from 'lucide-react';

// --- CONFIGURATION ---
const CHART_CONFIG = {
  fillColor: '#FFFF00',
  strokeColor: '#000000',
  fillOpacity: 0.6,
  strokeWidth: 2,
};

// --- SUB-COMPONENTS ---

interface DashboardProps {
  onSearchRequest: () => void;
}

const DashboardHeader: React.FC<{ totalCount: number; onSearch: () => void }> = ({ totalCount, onSearch }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    return (
      <header className="border-b-4 border-black pb-8" aria-label="En-tête du rapport">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold bg-black text-white px-2 py-1 mb-4 inline-block uppercase tracking-wider">
              Rapport Préliminaire
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4">
              Coût Social de la <span className="highlight-marker">Transparence</span>
            </h1>
            <p className="text-xl font-serif text-gray-800 leading-relaxed italic">
              "L'outil ne mesure pas seulement la fiabilité financière. Il mesure notre capacité à accepter la surveillance mutuelle comme nouveau contrat social."
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-mono text-6xl font-bold tracking-tighter" aria-label={`${totalCount} points de rupture identifiés`}>
              {totalCount}
            </div>
            <div className="font-mono text-sm uppercase border-t border-black pt-2 mt-1 w-full text-right" aria-hidden="true">
              Points de Rupture
            </div>
          </div>
        </div>

        {/* SIMULATION ACCESS BAR */}
        <div className="bg-[#FFFF00] p-6 border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-transform">
            <h2 className="font-mono text-sm font-bold uppercase mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Accès au Registre Public
            </h2>
            <form onSubmit={handleSearch} className="flex gap-0">
                <input 
                    type="text" 
                    placeholder="Entrez un nom ou N° Citoyen (ex: Moreau)" 
                    className="flex-1 p-4 font-mono text-lg border border-black focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-500"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="bg-black text-white px-8 font-mono font-bold uppercase hover:bg-gray-800 flex items-center gap-2"
                >
                    Consulter
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>
            <p className="mt-2 text-xs font-mono opacity-70">
                *Ceci est une simulation. Accéder au registre vous expose aux mécanismes de jugement social.
            </p>
        </div>
      </header>
    );
};

const RiskRadar: React.FC = () => (
  <div className="pt-8 border-t border-black/20 w-full" aria-label="Graphique radar des risques">
    <h3 className="font-mono text-xs uppercase text-gray-500 mb-4">Cartographie des Risques</h3>
    <div className="h-[250px] w-full -ml-4 md:-ml-6 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
          <PolarGrid stroke={CHART_CONFIG.strokeColor} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#000', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="Impact"
            dataKey="A"
            stroke={CHART_CONFIG.strokeColor}
            strokeWidth={CHART_CONFIG.strokeWidth}
            fill={CHART_CONFIG.fillColor}
            fillOpacity={CHART_CONFIG.fillOpacity}
          />
          <Tooltip 
             content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black text-white p-2 font-mono text-xs border border-white">
                    <p className="font-bold mb-1">{payload[0].payload.subject}</p>
                    <p>Score: <span className="text-[#FFFF00]">{payload[0].value}</span>/150</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const KeyMetricsPanel: React.FC<{ criticalCount: number }> = ({ criticalCount }) => (
  <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-black p-8 flex flex-col justify-between bg-[#F5F5F0]">
    <div className="space-y-12">
      <div role="status" aria-live="polite">
        <h3 className="font-mono text-xs uppercase text-gray-500 mb-2">Zone Critique</h3>
        <div className="text-5xl font-mono font-bold text-[#FF4500] flex items-baseline gap-2">
          {criticalCount} <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <p className="font-serif text-sm mt-2 font-medium">
          Défis à haut risque démocratique identifiés.
        </p>
      </div>
      <RiskRadar />
    </div>
  </div>
);

const CategoryGrid: React.FC<{ categoryCounts: Record<string, number> }> = ({ categoryCounts }) => {
  const categories = Object.values(Category);
  
  return (
    <div className="md:col-span-8 p-0" role="list" aria-label="Liste des catégories de défis">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0;
          return (
            <div 
              key={cat} 
              role="listitem"
              className={`
                p-6 
                border-black border-b 
                sm:border-r sm:[&:nth-of-type(2n)]:border-r-0 
                last:border-b-0 sm:[&:nth-last-of-type(2)]:border-b-0
                hover:bg-[#FFFF00] transition-colors duration-0 group cursor-crosshair focus-within:bg-[#FFFF00]
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-bold uppercase border border-black px-1 group-hover:bg-black group-hover:text-[#FFFF00] transition-colors">
                  {cat.split('&')[0].trim()}
                </span>
                <span className="font-mono text-xl font-bold" aria-label={`${count} dossiers`}>
                  {String(count).padStart(2, '0')}
                </span>
              </div>
              <h4 className="font-serif text-lg leading-tight group-hover:underline decoration-2 underline-offset-4">
                {cat}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CriticalNote: React.FC = () => (
  <div className="bg-black text-[#F5F5F0] p-6 font-mono text-sm flex gap-4 items-start" role="note">
    <Eye className="w-5 h-5 flex-shrink-0 mt-1 text-[#FFFF00]" aria-hidden="true" />
    <p className="max-w-3xl leading-relaxed">
      <span className="text-[#FFFF00] font-bold uppercase mr-2">Note de l'observatoire :</span>
      L'absence de régulation sur le "Scoring Social Sauvage" (Catégorie 4) représente le danger immédiat le plus élevé. Une intervention législative est recommandée avant tout déploiement technique.
    </p>
  </div>
);

// --- MAIN COMPONENT ---

const Dashboard: React.FC<DashboardProps> = ({ onSearchRequest }) => {
  // Memoization des calculs pour la performance
  const { criticalCount, totalCount, categoryCounts } = useMemo(() => {
    const critical = CHALLENGES.filter(
      c => c.category === Category.ETHICS || c.category === Category.LEGAL
    ).length;
    
    const counts = CHALLENGES.reduce((acc, challenge) => {
      acc[challenge.category] = (acc[challenge.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      criticalCount: critical,
      totalCount: CHALLENGES.length,
      categoryCounts: counts
    };
  }, []); // Dépendance vide car CHALLENGES est constant (importé)

  return (
    <div className="space-y-12 animate-in fade-in duration-0">
      <DashboardHeader totalCount={totalCount} onSearch={onSearchRequest} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <KeyMetricsPanel criticalCount={criticalCount} />
        <CategoryGrid categoryCounts={categoryCounts} />
      </div>

      <CriticalNote />
    </div>
  );
};

export default Dashboard;