import React, { useState } from 'react';
import { Save, Loader2, Plus, Trash2, ShieldCheck, Target } from 'lucide-react';
import { DecryptedUserData } from '../types';
import { Language, translations } from '../lib/i18n';

export default function Profile({ 
  data, 
  setData, 
  handleSave, 
  saving, 
  lang,
  showNumbers
}: { 
  data: DecryptedUserData, 
  setData: React.Dispatch<React.SetStateAction<DecryptedUserData>>, 
  handleSave: () => void, 
  saving: boolean, 
  lang: Language,
  showNumbers: boolean
}) {
  const t = translations[lang];
  const [newGoal, setNewGoal] = useState({ name: '', amount: '' });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.amount) return;
    setData(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id: Date.now().toString(),
          name: newGoal.name,
          amount: Number(newGoal.amount),
          saved: 0
        }
      ]
    }));
    setNewGoal({ name: '', amount: '' });
  };

  const updateGoalSaved = (id: string, savedAmount: number) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, saved: savedAmount } : g)
    }));
  };

  const removeGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            {t.incomeAndExpenses}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{t.monthlySalary}</label>
              <input 
                type={showNumbers ? "number" : "password"}
                inputMode="numeric"
                value={data.salary || ''}
                onChange={(e) => setData({...data, salary: Number(e.target.value) || 0})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{t.urgentExpenses}</label>
              <input 
                type={showNumbers ? "number" : "password"}
                inputMode="numeric"
                value={data.urgentAmount || ''}
                onChange={(e) => setData({...data, urgentAmount: Number(e.target.value) || 0})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{t.bankBalance}</label>
              <input 
                type={showNumbers ? "number" : "password"}
                inputMode="numeric"
                value={data.bankBalance || ''}
                onChange={(e) => setData({...data, bankBalance: Number(e.target.value) || 0})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors flex flex-col">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            {t.myGoals}
          </h2>
          
          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-6">
            <h3 className="text-sm font-medium mb-3">{t.addGoal}</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder={t.goalName}
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-sm outline-none"
              />
              <div className="flex gap-2">
                <input 
                  type={showNumbers ? "number" : "password"}
                  inputMode="numeric"
                  placeholder={t.goalAmount}
                  value={newGoal.amount}
                  onChange={(e) => setNewGoal({...newGoal, amount: e.target.value})}
                  className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-sm outline-none"
                />
                <button 
                  onClick={addGoal}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {data.goals.map(goal => (
              <div key={goal.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg relative bg-zinc-50 dark:bg-zinc-950/50">
                <button 
                  onClick={() => removeGoal(goal.id)}
                  className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="font-medium text-sm mb-2 pr-8">{goal.name} (DH {showNumbers ? goal.amount : '••••••'})</div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">{t.savedAmount}</label>
                  <input 
                    type={showNumbers ? "number" : "password"}
                    inputMode="numeric"
                    value={goal.saved || ''}
                    onChange={(e) => updateGoalSaved(goal.id, Number(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2 text-sm outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={saving} 
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-500/20"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
        {saving ? t.saving : t.saveData}
      </button>
    </div>
  );
}
