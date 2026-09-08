import React, { useState } from 'react';
import { db, doc, setDoc } from '../firebase';
import { Language, translations } from '../lib/i18n';
import { X, Send, MessageSquare } from 'lucide-react';

export default function FeedbackModal({ lang, onClose }: { lang: Language, onClose: () => void }) {
  const t = translations[lang];
  const [type, setType] = useState<'idea' | 'bug'>('idea');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setStatus('submitting');
    try {
      const feedbackId = Date.now().toString() + Math.random().toString(36).substring(2);
      await setDoc(doc(db, 'feedback', feedbackId), {
        type,
        message,
        email,
        createdAt: Date.now()
      });
      setStatus('success');
      setTimeout(onClose, 3000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            {t.feedbackTitle}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center text-green-600 dark:text-green-400">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>
            <p className="font-medium">{t.feedbackSent}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t.feedbackType}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input type="radio" checked={type === 'idea'} onChange={() => setType('idea')} className="text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  {t.feedbackIdea}
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input type="radio" checked={type === 'bug'} onChange={() => setType('bug')} className="text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  {t.feedbackBug}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t.feedbackMessage}</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-sm text-zinc-800 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t.feedbackEmail}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-2.5 text-sm text-zinc-800 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {t.sendFeedback}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
