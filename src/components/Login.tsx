import React, { useEffect, useState } from 'react';
import { loginWithGoogle, db, doc, getDoc } from '../firebase';
import { Wallet, ShieldCheck, Moon, Sun, Languages, Users } from 'lucide-react';
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
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const statsDoc = await getDoc(doc(db, 'stats', 'global'));
        if (statsDoc.exists()) {
          setTotalUsers(statsDoc.data().totalUsers || 0);
        }
      } catch (err) {
        console.error("Failed to load global stats", err);
      }
    }
    fetchStats();
  }, []);

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
      
      <div className="max-w-md w-full mx-auto mt-8 mb-4 text-center">
        <a 
          href="https://github.com/OutOfAmine/epargnes-intelligent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center justify-center space-y-1 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors group"
        >
          <span className="text-sm font-medium flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg>
            {t.loginRepoLinkTitle || "Remix it on GitHub"}
          </span>
          <span className="text-xs opacity-75">{t.loginRepoLinkDesc || "Run locally or build your own version"}</span>
        </a>
      </div>
      <div className="max-w-md w-full mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 text-center shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.loginTitle}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">{t.loginSubtitle}</p>
        
        {totalUsers !== null && totalUsers > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 px-3 rounded-full w-fit max-w-full mx-auto border flex-wrap text-center border-blue-100 dark:border-blue-800/50">
            <Users className="w-4 h-4" />
            <span>{t.joinPrefix} {totalUsers} {t.joinSuffix}</span>
          </div>
        )}
        
        <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 text-left">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">
            {t.authorGreeting}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t.authorIntro}
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-green-600 dark:text-green-400 mb-8 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 py-2 px-3 rounded-md">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>{t.loginSecure}</span>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-3 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{t.loginButton}</span>
                        </button>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <a 
            href="https://github.com/OutOfAmine/epargnes-intelligent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center justify-center space-y-1.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors group cursor-pointer"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg>
              {t.loginRepoLinkTitle || "Remix it on GitHub"}
            </span>
            <span className="text-xs opacity-75">{t.loginRepoLinkDesc || "Run locally or build your own version"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}