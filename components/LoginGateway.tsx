import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

interface LoginGatewayProps {
  onLogin: (method: 'GOOGLE' | 'FACEBOOK' | 'ANONYMOUS') => void;
}

const LoginGateway: React.FC<LoginGatewayProps> = ({ onLogin }) => {
  return (
    <div className="fixed inset-0 bg-[#F5F5F0] z-[100] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 animate-in zoom-in-95 duration-300">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-black text-white p-4 mb-4">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">Registre de Fiabilité</h1>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Identification Citoyenne Requise</p>
        </div>

        <div className="space-y-4">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-mono text-gray-400 uppercase">Connexion Sécurisée</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button 
            onClick={() => onLogin('GOOGLE')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 p-3 hover:bg-gray-50 transition-colors group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span className="font-mono text-sm font-bold text-gray-700 group-hover:text-black">Continuer avec Google</span>
          </button>

          <button 
            onClick={() => onLogin('FACEBOOK')}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] border border-[#1877F2] p-3 text-white hover:bg-[#166fe5] transition-colors"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.83c0-2.481 1.926-4.02 4.084-4.02 1.034 0 1.958.077 2.218.112v2.593l-1.52.001c-1.206 0-1.439.574-1.439 1.414v1.73h3.084l-.497 3.667h-2.587v7.98h-3.344z" />
            </svg>
            <span className="font-mono text-sm font-bold">Continuer avec Facebook</span>
          </button>

          <div className="pt-4 text-center">
            <button 
                onClick={() => onLogin('ANONYMOUS')}
                className="text-xs font-mono text-gray-400 hover:text-black underline decoration-dashed underline-offset-4 flex items-center justify-center gap-1 mx-auto"
            >
                <Lock className="w-3 h-3" />
                Accéder en tant qu'invité (Lecture Seule)
            </button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-black/10 text-center">
             <p className="font-serif text-[10px] text-gray-400 italic">
                En vous connectant, vous acceptez que votre Score de Fiabilité soit calculé et potentiellement visible selon les réglages de confidentialité en vigueur (Loi 2029-44).
             </p>
        </div>

      </div>
    </div>
  );
};

export default LoginGateway;