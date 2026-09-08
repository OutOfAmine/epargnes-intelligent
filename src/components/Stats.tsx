import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DecryptedUserData } from '../types';
import { Language, translations } from '../lib/i18n';
import { Lock } from 'lucide-react';

export default function Stats({ data, lang, showNumbers }: { data: DecryptedUserData, lang: Language, showNumbers: boolean }) {
  const t = translations[lang];
  
  const safeToSave = Math.max(0, data.salary - data.urgentAmount);
  
  // Custom tooltips to hide numbers if privacy is on
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-3 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-lg">
          <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {showNumbers ? `DH ${entry.value.toLocaleString()}` : '••••••'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const incomeVsExpenses = [
    {
      name: t.incomeAndExpenses,
      // Removed Salary to avoid exposing the full value, 
      // focusing purely on Expenses vs Savings capacity.
      expenses: data.urgentAmount,
      safeToSave: safeToSave,
    }
  ];

  const savingsDistribution = data.goals.length > 0 
    ? data.goals.map(g => ({ name: g.name, value: g.saved }))
    : [{ name: 'Unallocated', value: data.bankBalance }];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!showNumbers && (
        <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
          <Lock className="w-4 h-4" />
          Numbers are currently masked for privacy.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <h3 className="text-lg font-semibold mb-6">{t.incomeAndExpenses}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => showNumbers ? value : '•••'} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="expenses" name={t.urgentExpenses} fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="safeToSave" name={t.safeToSave} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <h3 className="text-lg font-semibold mb-6">{t.myGoals} (Distribution)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={savingsDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {savingsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
