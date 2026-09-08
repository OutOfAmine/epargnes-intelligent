const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  `import React from 'react';\nimport { loginWithGoogle } from '../firebase';`,
  `import React, { useEffect, useState } from 'react';\nimport { loginWithGoogle, db, doc, getDoc } from '../firebase';`
);

code = code.replace(
  `import { Wallet, ShieldCheck, Moon, Sun, Languages } from 'lucide-react';`,
  `import { Wallet, ShieldCheck, Moon, Sun, Languages, Users } from 'lucide-react';`
);

const loginComponentStart = `export default function Login({ 
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
  }, []);`;

code = code.replace(
  `export default function Login({ 
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
  const t = translations[lang];`,
  loginComponentStart
);

const statsUI = `        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.loginTitle}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">{t.loginSubtitle}</p>
        
        {totalUsers !== null && totalUsers > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 px-3 rounded-full w-max mx-auto border border-blue-100 dark:border-blue-800/50">
            <Users className="w-4 h-4" />
            <span>Join {totalUsers} savers trusting this app!</span>
          </div>
        )}`;

code = code.replace(
  `        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.loginTitle}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">{t.loginSubtitle}</p>`,
  statsUI
);

fs.writeFileSync('src/components/Login.tsx', code);
