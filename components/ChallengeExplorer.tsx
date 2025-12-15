import React, { useState } from 'react';
import { CHALLENGES, CATEGORY_COLORS } from '../constants';
import { Category, Challenge } from '../types';
import { ChevronDown, ArrowRight, X, AlertTriangle, Scale } from 'lucide-react';

interface ExplorerProps {
    onConsultAI: (challenge: Challenge) => void;
}

const ChallengeExplorer: React.FC<ExplorerProps> = ({ onConsultAI }) => {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredChallenges = filter === 'ALL' 
    ? CHALLENGES 
    : CHALLENGES.filter(c => c.category === filter);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-black pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-1">Dossiers d'Instruction</h2>
          <p className="font-mono text-xs uppercase tracking-wider text-gray-500">Index des problématiques recensées</p>
        </div>
        
        <div className="w-full md:w-auto">
            <label className="font-mono text-xs font-bold block mb-1">FILTRER PAR DOMAINE</label>
            <div className="relative">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value as Category | 'ALL')}
                    className="w-full md:w-64 bg-white border border-black rounded-none px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer hover:bg-[#FFFF00]"
                >
                    <option value="ALL">TOUS LES DOSSIERS</option>
                    {Object.values(Category).map((cat) => (
                        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
      </div>

      {/* List - Brutalist Style */}
      <div className="space-y-0 border-t border-black">
        {filteredChallenges.map((challenge) => {
            const isExpanded = expandedId === challenge.id;
            const colors = CATEGORY_COLORS[challenge.category];

            return (
              <div 
                key={challenge.id} 
                className={`
                    border-x border-b border-black transition-all duration-200
                    ${isExpanded ? 'bg-white my-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#F5F5F0] hover:bg-white'}
                `}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(challenge.id)}
                  className="p-4 md:p-6 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center relative group"
                >
                  {/* ID & Category */}
                  <div className="flex items-center gap-4 md:w-1/4 min-w-0">
                    <span className="font-mono text-xs font-bold text-gray-400">#{String(challenge.id).padStart(3, '0')}</span>
                    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${colors}`}>
                        {challenge.category.split(' ')[0]}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1">
                    <h3 className={`font-serif text-lg md:text-xl font-bold leading-tight group-hover:underline ${isExpanded ? 'underline' : ''}`}>
                        {challenge.title}
                    </h3>
                  </div>

                  {/* Icon */}
                  <div className="md:w-12 flex justify-end">
                     {isExpanded ? <X className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 md:p-8 pt-0 flex flex-col md:flex-row gap-8 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Left: The Facts */}
                    <div className="md:w-1/2 space-y-6">
                        <div>
                            <h4 className="font-mono text-xs font-bold uppercase mb-2 border-b border-black/20 pb-1">Constat de Problème</h4>
                            <p className="font-serif text-lg leading-relaxed bg-[#F5F5F0] p-4 border-l-4 border-black">
                                {challenge.problem}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-mono text-xs font-bold uppercase mb-2 border-b border-black/20 pb-1 text-[#FF4500]">Point de Tension</h4>
                            <p className="font-serif italic text-xl font-medium">
                                "{challenge.question}"
                            </p>
                        </div>
                    </div>

                    {/* Right: The Response & Action */}
                    <div className="md:w-1/2 flex flex-col justify-between border-t md:border-t-0 md:border-l border-black/10 md:pl-8 pt-6 md:pt-0">
                         <div>
                            <h4 className="font-mono text-xs font-bold uppercase mb-2 border-b border-black/20 pb-1">Piste Actuelle</h4>
                            <p className="font-mono text-sm leading-relaxed mb-8">
                                {challenge.solution}
                            </p>
                         </div>

                         <div className="bg-[#111] text-[#F5F5F0] p-6 mt-auto">
                            <h5 className="font-mono text-xs font-bold uppercase mb-2 text-[#FFFF00] flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Zone de Controverse
                            </h5>
                            <p className="text-sm opacity-80 mb-4 font-serif italic">
                                Cette mesure ignore potentiellement des effets de bord sociaux.
                            </p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onConsultAI(challenge);
                                }}
                                className="w-full bg-[#F5F5F0] text-black font-mono text-xs font-bold uppercase py-3 hover:bg-[#FFFF00] transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-black shadow-[4px_4px_0_0_#333] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                                <Scale className="w-4 h-4" />
                                Ouvrir la Contre-Enquête
                            </button>
                         </div>
                    </div>

                  </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default ChallengeExplorer;