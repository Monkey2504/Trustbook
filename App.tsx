import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChallengeExplorer from './components/ChallengeExplorer';
import AIAdvisor from './components/AIAdvisor';
import CitizenRecord from './components/CitizenRecord';
import LoginGateway from './components/LoginGateway'; // Importation
import { Challenge, UserProfile } from './types';

// États de l'interface
type ViewMode = 'SYNTHESIS' | 'EVIDENCE' | 'SIMULATION';

// Générateur de "bruit" pour l'identité publique (Black Mirror style)
const generatePublicHash = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&?*§";
    let result = "";
    // Format : XXX-XXXX-XXX avec symboles
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result; // Ex: "7k$9P#m2X!"
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('SYNTHESIS');
  const [isAnalysisPanelOpen, setAnalysisPanelOpen] = useState(false);
  const [activeDossier, setActiveDossier] = useState<Challenge | null>(null);
  
  // Gestion de la session utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      // Vérification simple de session locale
      const session = localStorage.getItem('trust_session');
      if (session) {
          setIsAuthenticated(true);
      }
  }, []);

  const handleLogin = (method: string) => {
      // Simulation d'authentification
      localStorage.setItem('trust_session', 'active');
      localStorage.setItem('trust_auth_method', method);
      
      // Si c'est une "vraie" connexion (Google/FB), on génère un profil avec un Hash Unique
      if (method !== 'ANONYMOUS') {
          // On vérifie si un profil existe déjà, sinon on en crée un nouveau
          const existingProfile = localStorage.getItem('trust_profile');
          
          if (!existingProfile) {
              const randomId = Math.floor(Math.random() * 9000) + 1000;
              const mockProfile: UserProfile = {
                  name: method === 'GOOGLE' ? 'Utilisateur Google' : 'Utilisateur Facebook',
                  idRef: `FR-${randomId}`,
                  publicHash: generatePublicHash() // Génération unique à la connexion
              };
              localStorage.setItem('trust_profile', JSON.stringify(mockProfile));
          }
      } else {
          // Mode invité : on nettoie le profil pour être sûr d'être anonyme
          localStorage.removeItem('trust_profile');
      }
      
      setIsAuthenticated(true);
  };

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

  const analyzeContext = (context: string) => {
      setAnalysisPanelOpen(true);
      setActiveDossier({
          id: 999,
          category: 'SIMULATION' as any,
          title: 'ANALYSE DE PROFIL INDIVIDUEL',
          problem: context,
          question: 'Est-ce éthiquement acceptable ?',
          solution: 'N/A'
      });
  };

  // Si pas authentifié, afficher le portail
  if (!isAuthenticated) {
      return <LoginGateway onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={viewMode} 
      setViewMode={setViewMode}
      isPanelOpen={isAnalysisPanelOpen}
      togglePanel={togglePanel}
    >
      <div className="flex h-full overflow-hidden">
        
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