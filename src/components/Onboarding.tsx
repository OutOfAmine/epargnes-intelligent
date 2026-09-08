import React, { useState } from 'react';
import { translations, Language } from '../lib/i18n';
import { DecryptedUserData } from '../types';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Onboarding({ 
  data, 
  setData, 
  onComplete 
}: { 
  data: DecryptedUserData, 
  setData: React.Dispatch<React.SetStateAction<DecryptedUserData>>,
  onComplete: () => Promise<void>
}) {
  const [step, setStep] = useState(0);
  const lang = (localStorage.getItem('lang') as Language) || 'fr';
  const t = translations[lang];

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onComplete();
  };

  const steps = [
    {
      title: t.onboardingTitle1,
      desc: t.onboardingDesc1,
      field: 'salary' as keyof DecryptedUserData,
    },
    {
      title: t.onboardingTitle2,
      desc: t.onboardingDesc2,
      field: 'urgentAmount' as keyof DecryptedUserData,
    },
    {
      title: t.onboardingTitle3,
      desc: t.onboardingDesc3,
      field: 'bankBalance' as keyof DecryptedUserData,
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: step >= i ? '100%' : '0%' }}
                className="h-full bg-blue-600"
              />
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-8 absolute inset-0 flex flex-col"
            >
              <div className="mb-2 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{steps[step].title}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">{steps[step].desc}</p>
              
              <div className="mt-auto relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">DH</span>
                <input
                  type="number"
                  value={data[steps[step].field] as number || ''}
                  onChange={(e) => setData({ ...data, [steps[step].field]: Number(e.target.value) || 0 })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-xl font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="0"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 text-zinc-500 dark:text-zinc-400 font-medium disabled:opacity-0 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {step === 2 ? <><Check className="w-4 h-4" /> {t.finish}</> : <>{t.next} <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
