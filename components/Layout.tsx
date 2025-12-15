import React from 'react';
import { Eye, FileText, Scale, X, Search } from 'lucide-react';

type ViewMode = 'SYNTHESIS' | 'EVIDENCE' | 'SIMULATION';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isPanelOpen: boolean;
  togglePanel: () => void;
}

/**
 * Sous-composant : Identité Statique du Registre
 */
const RegistryIdentity: React.FC = () => (
  <div className="flex items-center px-6 py-3 md:py-0 md:w-64 border-b md:border-b-0 md:border-r border-black bg-black text-[#F5F5F0]">
    <div className="leading-tight">
      <h1 className="font-mono font-bold text-lg tracking-tighter uppercase">Trust Register</h1>
      <span className="font-mono text-[10px] opacity-80 block">SECTION PUBLIQUE</span>
    </div>
  </div>
);

/**
 * Sous-composant : Bouton de Navigation (DRY)
 */
interface NavButtonProps {
  mode: ViewMode;
  currentView: ViewMode;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ mode, currentView, onClick, icon: Icon, label }) => {
  const isActive = currentView === mode;
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Afficher la vue ${label}`}
      className={`
        flex-1 md:flex-none md:w-48 flex items-center justify-center gap-2 border-r border-black/10 transition-colors duration-0
        focus-visible:outline-2 focus-visible:outline-black focus-visible:-outline-offset-2
        ${isActive
          ? 'bg-[#FFFF00] text-black font-bold border-b-4 border-b-black md:border-b-0 shadow-[inset_0_-4px_0_rgba(0,0,0,1)] md:shadow-none'
          : 'hover:bg-white text-gray-900'}
      `}
    >
      <Icon className="w-4 h-4 font-mono" aria-hidden="true" />
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </button>
  );
};

/**
 * Sous-composant : Interrupteur du Mode Critique
 */
const CriticalModeToggle: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    aria-pressed={isOpen}
    aria-label={isOpen ? "Désactiver le mode critique" : "Activer le mode critique"}
    className={`
      px-6 flex items-center justify-center gap-3 border-l border-black transition-all duration-0
      focus-visible:outline-2 focus-visible:outline-black focus-visible:-outline-offset-2
      ${isOpen
        ? 'bg-black text-[#FFFF00]'
        : 'bg-[#E5E5E0] text-gray-800 hover:text-black hover:bg-[#d4d4d0]'}
    `}
  >
    {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Scale className="w-5 h-5" aria-hidden="true" />}
    <div className="text-left hidden md:block">
      <span className="font-mono text-[10px] uppercase block leading-none opacity-80">Mode Critique</span>
      <span className="font-mono text-xs font-bold uppercase block leading-none">{isOpen ? 'ACTIF' : 'INACTIF'}</span>
    </div>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, currentView, setViewMode, isPanelOpen, togglePanel }) => {
  return (
    <div className="h-screen bg-[#F5F5F0] text-black font-serif flex flex-col overflow-hidden">
      
      {/* Skip Link pour Accessibilité Clavier */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-0 focus:left-0 focus:p-4 focus:bg-black focus:text-[#FFFF00] focus:font-mono focus:font-bold"
      >
        Aller au contenu principal
      </a>

      {/* HEADER */}
      <header className="flex-shrink-0 border-b-2 border-black bg-[#F5F5F0] z-50" role="banner">
        <div className="flex flex-col md:flex-row md:items-stretch h-auto md:h-16">
            
            <RegistryIdentity />

            {/* Navigation Sémantique */}
            <nav className="flex-1 flex" role="navigation" aria-label="Vues principales">
              <NavButton 
                mode="SYNTHESIS" 
                currentView={currentView} 
                onClick={() => setViewMode('SYNTHESIS')} 
                icon={Eye} 
                label="Synthèse" 
              />
              <NavButton 
                mode="SIMULATION" 
                currentView={currentView} 
                onClick={() => setViewMode('SIMULATION')} 
                icon={Search} 
                label="Registre" 
              />
              <NavButton 
                mode="EVIDENCE" 
                currentView={currentView} 
                onClick={() => setViewMode('EVIDENCE')} 
                icon={FileText} 
                label="Dossiers" 
              />
            </nav>

            <CriticalModeToggle isOpen={isPanelOpen} onToggle={togglePanel} />

        </div>
      </header>

      {/* Main Container */}
      <main id="main-content" className="flex-1 w-full relative overflow-hidden" role="main">
         {children}
      </main>

    </div>
  );
};

export default Layout;