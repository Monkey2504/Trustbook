import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChallengeExplorer from './components/ChallengeExplorer';
import AIAdvisor from './components/AIAdvisor';
import CitizenRecord from './components/CitizenRecord';
import { Challenge } from './types';

// États de l'interface : Introduction du mode SIMULATION
type ViewMode = 'SYNTHESIS' | 'EVIDENCE' | 'SIMULATION';

const App: React.FC = () => {
  // L'état par défaut est la Synthèse (Vue d'ensemble)
  const [viewMode, setViewMode] = useState<ViewMode>('SYNTHESIS');
  
  // La "Contre-Enquête" (IA)
  const [isAnalysisPanelOpen, setAnalysisPanelOpen] = useState(false);
  
  // Le contexte critique (quel dossier est en cours d'examen ?)
  const [activeDossier, setActiveDossier] = useState<Challenge | null>(null);

  const openInvestigation = (dossier: Challenge) => {
    setActiveDossier(dossier);
    setAnalysisPanelOpen(true);
  };

  const closeInvestigation = () => {
    setActiveDossier(null);
  };

  const togglePanel = () => {
    setAnalysisPanelOpen(!isAnalysisPanelOpen);
  };

  // Callback spécial pour le CitizenRecord pour analyser un point précis du profil
  const analyzeContext = (context: string) => {
      // On ouvre le panneau
      setAnalysisPanelOpen(true);
      
      // On crée un "Challenge fictif" pour porter le contexte à l'IA
      // Note: Idéalement AIAdvisor devrait accepter une prop 'initialQuery' ou 'contextOverride'
      // Ici, on utilise le state existant en détournant légèrement le type pour l'immédiateté
      setActiveDossier({
          id: 999,
          category: 'SIMULATION' as any,
          title: 'ANALYSE DE PROFIL INDIVIDUEL',
          problem: context,
          question: 'Est-ce éthiquement acceptable ?',
          solution: 'N/A'
      });
  };

  return (
    <Layout 
      currentView={viewMode} 
      setViewMode={setViewMode}
      isPanelOpen={isAnalysisPanelOpen}
      togglePanel={togglePanel}
    >
      <div className="flex h-full overflow-hidden">
        
        {/* ZONE PRINCIPALE : LES FAITS (Scrollable) */}
        <div className={`flex-1 overflow-y-auto bg-[#F5F5F0] transition-all duration-0 ${isAnalysisPanelOpen ? 'lg:w-2/3 border-r-2 border-black' : 'w-full'}`}>
          <div className="p-4 md:p-12 min-h-full">
            {viewMode === 'SYNTHESIS' && (
              <Dashboard onSearchRequest={() => setViewMode('SIMULATION')} />
            )}
            
            {viewMode === 'EVIDENCE' && (
              <ChallengeExplorer onConsultAI={openInvestigation} />
            )}

            {viewMode === 'SIMULATION' && (
              <CitizenRecord onAnalyze={analyzeContext} />
            )}
          </div>
        </div>

        {/* ZONE CRITIQUE : LA CONTRE-ENQUÊTE (Fixed / Sticky) */}
        {isAnalysisPanelOpen && (
          <div className="w-full lg:w-[450px] flex-shrink-0 bg-white border-t-2 lg:border-t-0 lg:border-l-0 border-black shadow-[-10px_0_0_0_rgba(0,0,0,0.1)] h-[50vh] lg:h-auto flex flex-col z-20 absolute bottom-0 lg:relative lg:bottom-auto lg:right-auto">
             <AIAdvisor 
                selectedChallenge={activeDossier} 
                onClearSelection={closeInvestigation}
             />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default App;