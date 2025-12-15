import React, { useState, useEffect, useRef } from 'react';
import { Challenge } from '../types';
import { consultAdvisor } from '../services/geminiService';
import { ArrowRight, Square, Terminal, AlertTriangle, CornerDownRight } from 'lucide-react';

interface AIAdvisorProps {
  selectedChallenge: Challenge | null;
  onClearSelection: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ selectedChallenge, onClearSelection }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial critical stance greeting
    const greetingText = selectedChallenge
        ? `ANALYSE DU DOSSIER : [${selectedChallenge.title.toUpperCase()}]\n\nLe système est prêt à déconstruire les hypothèses de ce dossier.`
        : "MODE VEILLE ACTIVÉ.\n\nSélectionnez un dossier à gauche pour initier une critique spécifique, ou interrogez le système globalement.";

    setMessages([
        {
          id: 'init',
          role: 'assistant',
          text: greetingText,
          timestamp: new Date()
        }
    ]);
  }, [selectedChallenge]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const contextChallenge = selectedChallenge || {
        id: 0,
        category: 'Général' as any,
        title: 'GLOBAL',
        problem: 'Discussion générale',
        question: 'Général',
        solution: 'N/A'
      };

      const responseText = await consultAdvisor(contextChallenge, userMsg.text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      const errorMsg: Message = {
         id: (Date.now() + 1).toString(),
         role: 'assistant',
         text: "ERREUR CRITIQUE : Connexion perdue.",
         timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      
      {/* Header - Compact Terminal Style */}
      <div className="bg-black text-[#F5F5F0] px-4 py-3 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
           <Terminal className="w-4 h-4 text-[#FFFF00]" />
           <div className="overflow-hidden">
              <h3 className="font-mono text-xs font-bold uppercase truncate">Contre-Enquête</h3>
              <p className="font-mono text-[10px] opacity-70 truncate max-w-[200px]">
                 {selectedChallenge ? `>> ${selectedChallenge.title}` : '>> SYSTÈME GLOBAL'}
              </p>
           </div>
        </div>
        {selectedChallenge && (
            <button 
                onClick={onClearSelection} 
                className="font-mono text-[10px] hover:text-[#FFFF00] border border-white/30 px-2 py-1 hover:border-[#FFFF00]"
                title="Détacher le dossier"
            >
                DÉTACHER
            </button>
        )}
      </div>

      {/* Output Area - Dense & Vertical */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-xs">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                {msg.role === 'user' ? 'INTERVENTION' : 'ANALYSE'}
            </span>
            
            <div className={`
                p-3 border max-w-full
                ${msg.role === 'user' 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-black shadow-[2px_2px_0_0_#ccc]'}
            `}>
              <div className="whitespace-pre-line leading-relaxed">
                  {msg.text.split('**').map((part, i) => 
                      i % 2 === 1 ? <span key={i} className="bg-[#FFFF00] text-black px-1 font-bold">{part}</span> : part
                  )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
           <div className="flex flex-col gap-2 w-full animate-pulse">
             <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">EN COURS...</span>
             <div className="bg-white text-black p-4 border border-black w-full flex items-center justify-center gap-2 h-16">
                <Square className="w-2 h-2 bg-black animate-spin" />
                <span className="font-mono text-[10px]">Déconstruction...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area - Compact */}
      <div className="bg-white border-t border-black p-4 flex-shrink-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedChallenge ? "Hypothèse critique..." : "Nouvelle requête..."}
            className="w-full bg-[#F5F5F0] border border-black p-3 pr-10 font-mono text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-black min-h-[60px] resize-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute bottom-3 right-3 bg-black text-white p-1.5 hover:bg-[#FFFF00] hover:text-black transition-colors disabled:opacity-50"
          >
            <CornerDownRight className="w-3 h-3" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-gray-500">
            <AlertTriangle className="w-3 h-3" />
            <span>VÉRIFIER LES ALLÉGATIONS.</span>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;