import React, { useState, useEffect } from 'react';
import { ShieldAlert, CreditCard, Users, Clock, AlertCircle, Search, Plus, Trash2, Save, X, Edit2, Eye, EyeOff } from 'lucide-react';
import { Incident, UserProfile, IncidentStatus } from '../types';

interface CitizenRecordProps {
  onAnalyze: (context: string) => void;
}

// --- UTILITAIRES ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(date);
};

// Données par défaut pour la première visite
const DEFAULT_PROFILE: UserProfile = {
    name: "Thomas Moreau",
    idRef: "FR-7892",
    publicHash: "8X$m9#KpL!" // Fallback par défaut
};

const DEFAULT_INCIDENTS: Incident[] = [
    {
        id: '1',
        date: new Date().toISOString(),
        title: "Défaut Paiement Cantine",
        description: "Retard de 3 mois sur frais scolaires municipaux.",
        amount: 124,
        status: 'SIGNALÉ',
        scoreImpact: -15
    }
];

const CitizenRecord: React.FC<CitizenRecordProps> = ({ onAnalyze }) => {
  // --- ETATS ---
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [incidents, setIncidents] = useState<Incident[]>(DEFAULT_INCIDENTS);
  
  // Mode Confidentialité activé par défaut selon la demande
  const [isRedacted, setIsRedacted] = useState(true); 

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingIncident, setIsAddingIncident] = useState(false);
  
  // Formulaire d'ajout
  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
      title: '',
      amount: 0,
      description: '',
      status: 'SIGNALÉ'
  });

  // --- PERSISTANCE (LocalStorage) ---
  useEffect(() => {
      const savedProfile = localStorage.getItem('trust_profile');
      const savedIncidents = localStorage.getItem('trust_incidents');
      
      if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          // Si le profil sauvegardé n'a pas de hash (ancienne version), on utilise celui par défaut
          if (!parsedProfile.publicHash) {
              parsedProfile.publicHash = "X9#?m2$L";
          }
          setProfile(parsedProfile);
      }
      if (savedIncidents) setIncidents(JSON.parse(savedIncidents));
  }, []);

  useEffect(() => {
      localStorage.setItem('trust_profile', JSON.stringify(profile));
      localStorage.setItem('trust_incidents', JSON.stringify(incidents));
  }, [profile, incidents]);

  // --- ACTIONS ---
  
  const handleAddIncident = () => {
      if (!newIncident.title) return;

      const incident: Incident = {
          id: generateId(),
          date: new Date().toISOString(),
          title: newIncident.title || 'Incident inconnu',
          description: newIncident.description || '',
          amount: Number(newIncident.amount) || 0,
          status: (newIncident.status as IncidentStatus) || 'SIGNALÉ',
          scoreImpact: -Math.floor(Math.random() * 10) - 5
      };

      setIncidents([incident, ...incidents]);
      setIsAddingIncident(false);
      setNewIncident({ title: '', amount: 0, description: '', status: 'SIGNALÉ' });
  };

  const handleDeleteIncident = (id: string) => {
      setIncidents(incidents.filter(i => i.id !== id));
  };

  const calculateScore = () => {
      let baseScore = 100;
      incidents.forEach(inc => {
          if (inc.status === 'SIGNALÉ') baseScore -= 15;
          if (inc.status === 'EN ATTENTE') baseScore -= 5;
          if (inc.status === 'VÉRIFIÉ') baseScore += 2;
      });
      const totalDebt = incidents.reduce((acc, curr) => acc + curr.amount, 0);
      baseScore -= Math.floor(totalDebt / 100);

      return Math.max(0, Math.min(100, baseScore));
  };

  const totalDebt = incidents.reduce((acc, curr) => acc + curr.amount, 0);
  const score = calculateScore();
  const alertCount = incidents.filter(i => i.status === 'SIGNALÉ').length;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* --- HEADER IDENTITÉ --- */}
      <div className="border-b-2 border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-4 relative">
        
        {/* Toggle Confidentialité */}
        <button 
            onClick={() => setIsRedacted(!isRedacted)}
            className="absolute top-0 right-0 md:relative md:top-auto md:right-auto md:ml-auto md:order-3 bg-[#E5E5E0] hover:bg-black hover:text-white p-2 rounded-full transition-colors flex items-center gap-2"
            title={isRedacted ? "Afficher les informations" : "Masquer les informations"}
        >
            {isRedacted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-[10px] font-mono font-bold uppercase hidden md:inline">
                {isRedacted ? "Vue Publique" : "Vue Propriétaire"}
            </span>
        </button>

        <div className="w-full md:w-auto md:order-1">
           <div className="flex items-center gap-2 mb-2">
              {score < 50 ? (
                  <span className="bg-red-600 text-white font-mono text-xs font-bold px-2 py-0.5 uppercase blink">Profil à Risque</span>
              ) : (
                  <span className="bg-green-600 text-white font-mono text-xs font-bold px-2 py-0.5 uppercase">Profil Stable</span>
              )}
              <span className="font-mono text-xs text-gray-500 uppercase">
                  {isRedacted ? 'UID: PROTECTED' : `Réf: #${profile.idRef}`}
              </span>
           </div>
           
           {isEditingProfile && !isRedacted ? (
               <div className="flex gap-2 items-center">
                   <input 
                       type="text" 
                       value={profile.name}
                       onChange={(e) => setProfile({...profile, name: e.target.value})}
                       className="text-4xl font-serif font-bold border-b border-black focus:outline-none bg-transparent w-full md:w-96"
                       autoFocus
                   />
                   <button onClick={() => setIsEditingProfile(false)} className="bg-black text-white p-2 hover:bg-[#FFFF00] hover:text-black">
                       <Save className="w-4 h-4" />
                   </button>
               </div>
           ) : (
               <div className="group flex items-center gap-2 cursor-pointer" onClick={() => !isRedacted && setIsEditingProfile(true)}>
                   <h2 className={`text-4xl font-bold border-b border-transparent transition-all ${isRedacted ? 'font-mono text-3xl tracking-widest bg-black text-white px-4 py-1 select-all' : 'font-serif group-hover:border-black'}`}>
                       {isRedacted ? (profile.publicHash || "LOADING...") : profile.name}
                   </h2>
                   {!isRedacted && <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-50" />}
               </div>
           )}
           <p className="font-mono text-sm text-gray-600 mt-2">
               {isRedacted 
                ? "Identité chiffrée (Chiffres/Lettres/Symboles)." 
                : "Identité vérifiée (Authentification Forte)"}
           </p>
        </div>
        
        <div className="flex items-center gap-4 md:order-2">
            <div className="text-right">
                <div className="font-mono text-xs font-bold uppercase text-gray-500">Score de Fiabilité</div>
                <div className={`text-5xl font-mono font-bold ${score < 50 ? 'text-red-600' : 'text-black'}`}>
                    {score}<span className="text-xl text-black opacity-50">/100</span>
                </div>
            </div>
            <div className={`h-12 w-12 text-white flex items-center justify-center ${score < 50 ? 'bg-red-600' : 'bg-black'}`}>
                <ShieldAlert className="w-6 h-6" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLONNE 1 : STATISTIQUES --- */}
        <div className="space-y-6">
            <div className="bg-white border border-black p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <h3 className="font-mono text-xs font-bold uppercase border-b border-black pb-2 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Dette Déclarée
                </h3>
                <div className="text-3xl font-mono font-bold mb-1">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalDebt)}
                </div>
                {alertCount > 0 && (
                    <div className="text-xs text-red-600 font-bold uppercase flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {alertCount} incidents critiques
                    </div>
                )}
            </div>

            <div className="bg-[#E5E5E0] border border-black p-6">
                <h3 className="font-mono text-xs font-bold uppercase border-b border-black pb-2 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Statut de Visibilité
                </h3>
                <p className="font-serif text-sm italic mb-4">
                    {isRedacted 
                        ? "Pour le public, vous n'êtes qu'une suite de données aléatoire. Votre dette, elle, reste visible."
                        : "Vous consultez vos propres données. Vous seul voyez les détails nominatifs."}
                </p>
                <div className="flex gap-2 flex-wrap">
                    <span className={`text-white text-[10px] px-2 py-1 font-mono ${isRedacted ? 'bg-black' : 'bg-red-600'}`}>
                        {isRedacted ? 'Anonymat: ACTIF' : 'Identité: RÉVÉLÉE'}
                    </span>
                </div>
            </div>
        </div>

        {/* --- COLONNE 2 : HISTORIQUE INTERACTIF --- */}
        <div className="lg:col-span-2 bg-white border border-black min-h-[400px] flex flex-col">
            <div className="bg-black text-white p-3 flex justify-between items-center">
                <h3 className="font-mono text-xs font-bold uppercase">Journal des Incidents</h3>
                <Clock className="w-4 h-4" />
            </div>
            
            {/* Formulaire d'ajout (Toggle) */}
            {isAddingIncident ? (
                <div className="p-6 bg-[#FFFF00] border-b border-black animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-mono text-sm font-bold uppercase">Nouvel Incident / Dette</h4>
                        <button onClick={() => setIsAddingIncident(false)}><X className="w-5 h-5"/></button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-mono text-[10px] mb-1">TITRE / CRÉANCIER</label>
                                <input 
                                    className="w-full p-2 border border-black font-serif text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Ex: Loyer Janvier"
                                    value={newIncident.title}
                                    onChange={e => setNewIncident({...newIncident, title: e.target.value})}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] mb-1">MONTANT (€)</label>
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="0"
                                    value={newIncident.amount}
                                    onChange={e => setNewIncident({...newIncident, amount: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] mb-1">DESCRIPTION</label>
                            <input 
                                className="w-full p-2 border border-black font-serif text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Détails de l'incident..."
                                value={newIncident.description}
                                onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-mono text-[10px] mb-1">STATUT</label>
                                <select 
                                    className="w-full p-2 border border-black font-mono text-xs"
                                    value={newIncident.status}
                                    onChange={e => setNewIncident({...newIncident, status: e.target.value as IncidentStatus})}
                                >
                                    <option value="SIGNALÉ">SIGNALÉ (Critique)</option>
                                    <option value="EN ATTENTE">EN ATTENTE (Moyen)</option>
                                    <option value="VÉRIFIÉ">VÉRIFIÉ (Positif)</option>
                                </select>
                            </div>
                            <button 
                                onClick={handleAddIncident}
                                className="bg-black text-white font-mono text-xs font-bold uppercase hover:bg-white hover:text-black border border-black transition-colors mt-auto h-9"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Liste des Incidents */}
            <div className="divide-y divide-black/10 flex-1 overflow-y-auto max-h-[600px]">
                {incidents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-serif italic">
                        Aucun incident enregistré. Votre casier est vierge.
                    </div>
                ) : (
                    incidents.map((incident, index) => (
                        <div key={incident.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors group relative">
                            <div className="w-16 pt-1 flex-shrink-0">
                                <span className="font-mono text-[10px] font-bold text-gray-500 block">
                                    {formatDate(incident.date)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    {/* Titre Masqué ou Visible */}
                                    <h4 className={`font-bold font-serif text-sm truncate pr-2 ${isRedacted ? 'text-gray-500 font-mono text-[10px] uppercase' : ''}`}>
                                        {isRedacted ? `HASH: ${incident.id.toUpperCase()}_ERR_302` : incident.title}
                                    </h4>
                                    
                                    <span className={`
                                        text-[10px] font-bold px-2 py-0.5 border
                                        ${incident.status === 'SIGNALÉ' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                                        ${incident.status === 'VÉRIFIÉ' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                        ${incident.status === 'EN ATTENTE' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                                        ${incident.status === 'RÉSOLU' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                                    `}>
                                        {incident.status}
                                    </span>
                                </div>
                                
                                {/* Description Floutée ou Visible */}
                                <div className={`text-sm mt-1 text-gray-600 truncate relative ${isRedacted ? 'select-none' : ''}`}>
                                    <span className={isRedacted ? 'blur-[5px] opacity-40 bg-gray-300 text-transparent' : ''}>
                                        {incident.description || "Détails non spécifiés pour cet incident."}
                                    </span>
                                    {isRedacted && (
                                        <span className="absolute left-0 top-0 text-[10px] font-mono px-1 uppercase text-red-500 font-bold tracking-widest">
                                            [DONNÉE CHIFFRÉE]
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!isRedacted && (
                                        <button 
                                            onClick={() => handleDeleteIncident(incident.id)}
                                            className="text-[10px] font-mono border border-black px-2 py-1 hover:bg-red-600 hover:text-white uppercase flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" /> Supprimer
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => onAnalyze(`Analyse l'impact de cette dette : ${incident.amount}€ (Nature: ${incident.title}) statut ${incident.status}`)}
                                        className="text-[10px] font-mono border border-black bg-[#FFFF00] px-2 py-1 hover:bg-black hover:text-[#FFFF00] uppercase flex items-center gap-1"
                                    >
                                        <Search className="w-3 h-3" /> IA
                                    </button>
                                </div>
                            </div>
                            
                            {/* Montant TOUJOURS visible */}
                            <div className={`text-right font-mono text-sm font-bold flex-shrink-0 w-20 ${incident.status === 'SIGNALÉ' ? 'text-red-600' : 'text-gray-400'}`}>
                                {incident.amount > 0 ? `-${incident.amount}€` : '-'}
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Footer d'action - Masqué en mode confidentialité pour éviter les erreurs */}
            {!isAddingIncident && !isRedacted && (
                <div className="bg-[#F5F5F0] p-4 text-center border-t border-black sticky bottom-0">
                    <button 
                        onClick={() => setIsAddingIncident(true)}
                        className="w-full bg-black text-white font-mono text-sm font-bold uppercase py-3 hover:bg-[#FFFF00] hover:text-black transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un dossier / dette
                    </button>
                </div>
            )}
            {/* Footer alternatif en mode privé */}
            {!isAddingIncident && isRedacted && (
                <div className="bg-[#F5F5F0] p-4 text-center border-t border-black sticky bottom-0">
                    <p className="font-mono text-xs text-gray-500 italic">
                        Identifiez-vous pour modifier le registre.
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default CitizenRecord;