import React from 'react';
import { loginWithGoogle } from '../firebase';
import { Wallet, ShieldCheck, Moon, Sun, Languages } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

export default function Login({ 
  darkMode, 
  toggleDarkMode,
  lang,
  setLang
}: { 
  darkMode: boolean, 
  toggleDarkMode: () => void,
  lang: Language,
  setLang: (l: Language) => void
}) {
  const t = translations[lang];

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button 
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-2 text-sm font-medium uppercase"
        >
          <Languages className="w-5 h-5" /> <span className="hidden sm:inline">{lang}</span>
        </button>
        <button 
          onClick={toggleDarkMode}
          className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="max-w-sm w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.loginTitle}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">{t.loginSubtitle}</p>
        
        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-green-600 dark:text-green-400 mb-8 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 py-2 px-3 rounded-md">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>{t.loginSecure}</span>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{t.loginButton}</span>
        </button>
      </div>
    </div>
  );
}
