import { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import Chatbot from './components/Chatbot';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import FeedbackModal from './components/FeedbackModal';
import { LogOut, Wallet, Moon, Sun, Languages, LayoutDashboard, BarChart3, Loader2, MessageSquare, UserCircle, Github, Linkedin, Eye, EyeOff } from 'lucide-react';
import { Language, translations } from './lib/i18n';
import { auth, db, doc, getDoc, setDoc, onAuthStateChanged, logout } from './firebase';
import { increment } from 'firebase/firestore';
import { decryptData, encryptData } from './lib/encryption';
import { DecryptedUserData, UserData, Goal } from './types';
import { User } from 'firebase/auth';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'fr';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (user) {
      idleTimerRef.current = setTimeout(() => {
        logout();
        alert(translations[lang].sessionExpired);
      }, IDLE_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      resetIdleTimer();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const events = ['mousemove', 'keydown', 'scroll', 'click'];
      const handleActivity = () => resetIdleTimer();
      events.forEach(event => window.addEventListener(event, handleActivity));
      return () => {
        events.forEach(event => window.removeEventListener(event, handleActivity));
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
    }
  }, [user, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-colors">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} lang={lang} setLang={setLang} />;
  }

  return (
    <MainContent 
      user={user} 
      lang={lang} 
      setLang={setLang} 
      darkMode={darkMode} 
      setDarkMode={setDarkMode} 
    />
  );
}

function MainContent({ user, lang, setLang, darkMode, setDarkMode }: { user: User, lang: Language, setLang: (l: Language) => void, darkMode: boolean, setDarkMode: (d: boolean) => void }) {
  const [data, setData] = useState<DecryptedUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stats' | 'profile'>('dashboard');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [showNumbers, setShowNumbers] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    async function loadStats() {
      try {
        const statsDoc = await getDoc(doc(db, 'stats', 'global'));
        if (statsDoc.exists()) {
          setTotalUsers(statsDoc.data().totalUsers || 0);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
  }, []);

  useEffect(() => {
    async function loadUserData() {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const encrypted = docSnap.data() as UserData;
          let parsedGoals: Goal[] = [];
          if (encrypted.goalsEncrypted) {
            try {
              const decryptedStr = decryptData(encrypted.goalsEncrypted, user.uid);
              parsedGoals = JSON.parse(decryptedStr);
            } catch (e) {}
          }
          setData({
            salary: Number(decryptData(encrypted.salary, user.uid)) || 0,
            urgentAmount: Number(decryptData(encrypted.urgentAmount, user.uid)) || 0,
            bankBalance: Number(decryptData(encrypted.bankBalance, user.uid)) || 0,
            goals: parsedGoals,
            onboardingCompleted: encrypted.onboardingCompleted || false
          });
        } else {
          setData({ salary: 0, urgentAmount: 0, bankBalance: 0, goals: [], onboardingCompleted: false });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadUserData();
  }, [user.uid]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const isNewUser = !userDocSnap.exists();

      const encryptedData: UserData = {
        salary: encryptData(data.salary.toString(), user.uid),
        urgentAmount: encryptData(data.urgentAmount.toString(), user.uid),
        bankBalance: encryptData(data.bankBalance.toString(), user.uid),
        goalsEncrypted: encryptData(JSON.stringify(data.goals), user.uid),
        onboardingCompleted: true
      };
      
      await setDoc(userDocRef, encryptedData);

      if (isNewUser) {
        const statsRef = doc(db, 'stats', 'global');
        await setDoc(statsRef, { totalUsers: increment(1) }, { merge: true });
        setTotalUsers(prev => (prev || 0) + 1);
      }

      setData({ ...data, onboardingCompleted: true });
      setShowNumbers(false);
      
      // If we are on profile tab, maybe switch to dashboard after save? No, let them stay.
    } catch (error) {
      console.error("Error saving data:", error);
      alert(t.errorSaving);
    }
    setSaving(false);
  };

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  if (!data.onboardingCompleted) {
    return <Onboarding data={data} setData={setData} onComplete={handleSave} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300 flex flex-col">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight hidden sm:block">{t.appTitle}</span>
              {totalUsers !== null && (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 sm:ml-4">
                  {t.totalUsers}: {totalUsers}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowNumbers(!showNumbers)}
                className={`p-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium cursor-pointer ${showNumbers ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Toggle Privacy"
              >
                {showNumbers ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">{t.contactUs}</span>
              </button>
              <button 
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-2 text-sm font-medium uppercase cursor-pointer"
              >
                <Languages className="w-4 h-4" /> <span className="hidden sm:inline">{lang}</span>
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={logout}
                className="text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">{t.dashboard}</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'stats' 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> <span className="hidden sm:inline">{t.stats}</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <UserCircle className="w-4 h-4" /> <span className="hidden sm:inline">{t.profile}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'dashboard' && <Dashboard data={data} lang={lang} showNumbers={showNumbers} setShowNumbers={setShowNumbers} setActiveTab={setActiveTab} />}
            {activeTab === 'stats' && <Stats data={data} lang={lang} showNumbers={showNumbers} />}
            {activeTab === 'profile' && <Profile data={data} setData={setData} handleSave={handleSave} saving={saving} lang={lang} showNumbers={showNumbers} />}
          </div>
          <div className="lg:col-span-1">
            <Chatbot uid={user.uid} lang={lang} />
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 py-8 text-center bg-white dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-4">
          <a href="https://github.com/OutOfAmine/epargnes-intelligent" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
            {t.remixTitle}
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t.remixDesc}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            <span className="font-medium">{t.codedBy}</span>
            <a href="https://github.com/OutOfAmine" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/aminejerraryy/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      {isFeedbackOpen && (
        <FeedbackModal lang={lang} onClose={() => setIsFeedbackOpen(false)} />
      )}
    </div>
  );
}
