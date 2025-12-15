import React from 'react';
import { ShieldAlert, CreditCard, Users, Clock, AlertCircle, Search, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Challenge } from '../types';

interface CitizenRecordProps {
  onAnalyze: (context: string) => void;
}

const CitizenRecord: React.FC<CitizenRecordProps> = ({ onAnalyze }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Simulation Header */}
      <div className="border-b-2 border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white font-mono text-xs font-bold px-2 py-0.5 uppercase blink">Profil à Risque</span>
              <span className="font-mono text-xs text-gray-500 uppercase">Réf: #8492-AX</span>
           </div>
           <h2 className="text-4xl font-serif font-bold">Moreau, Thomas</h2>
           <p className="font-mono text-sm text-gray-600">Dernière mise à jour : Il y a 2 heures</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="font-mono text-xs font-bold uppercase text-gray-500">Score de Fiabilité</div>
                <div className="text-5xl font-mono font-bold text-red-600">42<span className="text-xl text-black">/100</span></div>
            </div>
            <div className="h-12 w-12 bg-black text-white flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne 1 : État Civil & Financier */}
        <div className="space-y-6">
            <div className="bg-white border border-black p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <h3 className="font-mono text-xs font-bold uppercase border-b border-black pb-2 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Dette Cumulée
                </h3>
                <div className="text-3xl font-mono font-bold mb-1">2 450,00 €</div>
                <div className="text-xs text-red-600 font-bold uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    3 Créanciers non remboursés
                </div>
            </div>

            <div className="bg-[#E5E5E0] border border-black p-6">
                <h3 className="font-mono text-xs font-bold uppercase border-b border-black pb-2 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Réseau Social
                </h3>
                <p className="font-serif text-sm italic mb-4">
                    "Le sujet fréquente majoritairement d'autres profils à bas score, augmentant son facteur de risque systémique."
                </p>
                <div className="flex gap-2 flex-wrap">
                    <span className="bg-black text-white text-[10px] px-2 py-1 font-mono">Lien: Débiteur</span>
                    <span className="bg-black text-white text-[10px] px-2 py-1 font-mono">Cercle: Précaire</span>
                </div>
            </div>
        </div>

        {/* Colonne 2 : Historique des Transactions */}
        <div className="lg:col-span-2 bg-white border border-black">
            <div className="bg-black text-white p-3 flex justify-between items-center">
                <h3 className="font-mono text-xs font-bold uppercase">Journal des Incidents</h3>
                <Clock className="w-4 h-4" />
            </div>
            
            <div className="divide-y divide-black/10">
                {/* Incident 1 */}
                <div className="p-4 flex gap-4 hover:bg-red-50 transition-colors group">
                    <div className="w-16 pt-1">
                        <span className="font-mono text-[10px] font-bold text-gray-500">J-2</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold font-serif text-sm">Remboursement manqué (Tiers: "Lydia")</h4>
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 border border-red-200">SIGNALÉ</span>
                        </div>
                        <p className="text-sm mt-1">Défaut de paiement de 45€ pour "Frais partagés". Signalement automatique par API.</p>
                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[10px] font-mono border border-black px-2 py-1 hover:bg-black hover:text-white uppercase">Contester</button>
                            <button 
                                onClick={() => onAnalyze("Analyse cet incident : Le défaut de paiement de 45€ a entraîné une baisse de 15 points du score global. Est-ce proportionné ?")}
                                className="text-[10px] font-mono border border-black bg-[#FFFF00] px-2 py-1 hover:bg-black hover:text-[#FFFF00] uppercase flex items-center gap-1"
                            >
                                <Search className="w-3 h-3" /> Analyser l'impact
                            </button>
                        </div>
                    </div>
                    <div className="text-right font-mono text-sm font-bold text-red-600">-15 pts</div>
                </div>

                {/* Incident 2 */}
                <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-16 pt-1">
                        <span className="font-mono text-[10px] font-bold text-gray-500">J-14</span>
                    </div>
                    <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold font-serif text-sm">Validation Tiers (Bailleur)</h4>
                            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 border border-green-200">VÉRIFIÉ</span>
                        </div>
                        <p className="text-sm mt-1">Paiement loyer confirmé. Aucune anomalie détectée.</p>
                    </div>
                    <div className="text-right font-mono text-sm font-bold text-green-600">+2 pts</div>
                </div>

                {/* Incident 3 */}
                <div className="p-4 flex gap-4 hover:bg-red-50 transition-colors group">
                    <div className="w-16 pt-1">
                        <span className="font-mono text-[10px] font-bold text-gray-500">J-45</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold font-serif text-sm">Dette Informelle (Famille)</h4>
                            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 border border-yellow-200">EN ATTENTE</span>
                        </div>
                        <p className="text-sm mt-1">Prêt de 500€ déclaré par tiers "J. Moreau". Statut: Non résolu.</p>
                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => onAnalyze("Analyse ce cas : Une dette familiale de 500€ est rendue publique sur le registre. Quelles sont les conséquences psychologiques et sociales ?")}
                                className="text-[10px] font-mono border border-black bg-[#FFFF00] px-2 py-1 hover:bg-black hover:text-[#FFFF00] uppercase flex items-center gap-1"
                            >
                                <Search className="w-3 h-3" /> Analyser l'impact
                            </button>
                        </div>
                    </div>
                    <div className="text-right font-mono text-sm font-bold text-gray-400">0 pts</div>
                </div>
            </div>
            
            <div className="bg-[#F5F5F0] p-4 text-center border-t border-black">
                <p className="font-mono text-xs text-gray-500 mb-2">Vous avez une information sur ce dossier ?</p>
                <button className="w-full bg-black text-white font-mono text-sm font-bold uppercase py-3 hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <ThumbsDown className="w-4 h-4" />
                    Signaler un incident de paiement
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CitizenRecord;