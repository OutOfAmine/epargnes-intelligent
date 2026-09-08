import React, { useState } from 'react';
import { Eye, EyeOff, Target, TrendingUp, AlertCircle, Lock, ShieldCheck, AlertTriangle, ArrowRight, HandMetal } from 'lucide-react';
import { auth, db, doc } from '../firebase';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, increment } from 'firebase/firestore';
import { DecryptedUserData } from '../types';
import { Language, translations } from '../lib/i18n';

export default function Dashboard({ 
  data, 
  lang, 
  showNumbers, 
  setShowNumbers, 
  setActiveTab 
}: { 
  data: DecryptedUserData, 
  lang: Language, 
  showNumbers: boolean, 
  setShowNumbers: (show: boolean) => void,
  setActiveTab: (tab: 'dashboard' | 'stats' | 'profile') => void
}) {
  const t = translations[lang];
  const displayName = auth.currentUser?.displayName || 'Savers';

  const formatValue = (val: number) => showNumbers ? val.toLocaleString() : '••••••';
  const totalSaved = data.goals.reduce((acc, g) => acc + g.saved, 0);
  const totalGoal = data.goals.reduce((acc, g) => acc + g.amount, 0);
  const totalProgress = totalGoal > 0 ? (totalSaved / totalGoal) * 100 : 0;
  
  const safeToSave = Math.max(0, data.salary - data.urgentAmount);

  const handleDeleteAccount = async () => {
    if (window.confirm(t.deleteAccountConfirm)) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteDoc(doc(db, 'users', user.uid));
          await deleteUser(user);
        }
      } catch (error: any) {
        console.error("Error deleting account:", error);
        if (error.code === 'auth/requires-recent-login') {
          alert(t.requiresRecentLogin);
        } else {
          alert("Error deleting account. Please try again.");
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Security Info Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4 flex items-start gap-4">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
          <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">{t.securityExplanationTitle}</h3>
          <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
            {t.securityExplanationText}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            Yoooooo {displayName} <HandMetal className="w-6 h-6 text-yellow-500" />
          </h1>
          <h2 className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            {t.loginSecure} <Lock className="w-4 h-4 text-green-500" />
          </h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="p-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer"
          >
            {t.updateNumbersPrompt || "Update Numbers"} <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowNumbers(!showNumbers)}
            className={`p-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium cursor-pointer ${showNumbers ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}
            title="Toggle Privacy"
          >
            {showNumbers ? (
              <><Eye className="w-4 h-4" /> <span className="hidden sm:inline">{t.privacyToggleHide}</span></>
            ) : (
              <><EyeOff className="w-4 h-4" /> <span className="hidden sm:inline">{t.privacyToggleShow}</span></>
            )}
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{t.monthlySalary}</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">DH {formatValue(data.salary)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{t.urgentExpenses}</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">DH {formatValue(data.urgentAmount)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-zinc-900 transition-colors">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">{t.safeToSave}</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            DH {formatValue(safeToSave)}
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      {data.goals.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              {t.myGoals}
            </h2>
            <div className="text-sm font-medium text-zinc-500">
              Total: DH {formatValue(totalSaved)} / {formatValue(totalGoal)}
            </div>
          </div>
          
          <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-8 shadow-inner">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${Math.min(100, totalProgress)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          <div className="space-y-4">
            {data.goals.map(goal => {
              const progress = goal.amount > 0 ? (goal.saved / goal.amount) * 100 : 0;
              return (
                <div key={goal.id} className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{goal.name}</span>
                    <span className="text-zinc-500">DH {formatValue(goal.saved)} / {formatValue(goal.amount)}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="pt-8 mt-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-red-800 dark:text-red-400 font-semibold flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5" />
              {t.dangerZone}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-500/80">
              {t.dangerZoneDescription}
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.deleteAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
