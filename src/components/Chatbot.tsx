import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { db, doc, getDoc } from '../firebase';
import { decryptData } from '../lib/encryption';
import { UserData, Goal } from '../types';
import { translations, Language } from '../lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export default function Chatbot({ uid, lang }: { uid: string, lang: Language }) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: t.chatbotGreeting }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Update greeting when language changes
    setMessages([{ id: '1', role: 'bot', text: t.chatbotGreeting }]);
  }, [lang]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      let context = {};
      if (docSnap.exists()) {
        const encrypted = docSnap.data() as UserData;
        let parsedGoals: Goal[] = [];
        
        if (encrypted.goalsEncrypted) {
          try {
            const decryptedStr = decryptData(encrypted.goalsEncrypted, uid);
            parsedGoals = JSON.parse(decryptedStr);
          } catch (e) {}
        } else if (encrypted.goalName) {
          parsedGoals = [{
            id: 'legacy-1',
            name: encrypted.goalName || '',
            amount: Number(decryptData(encrypted.goalAmount || '', uid)) || 0,
            saved: Number(decryptData(encrypted.savedAmount || '', uid)) || 0
          }];
        }

        context = {
          salary: Number(decryptData(encrypted.salary, uid)),
          urgentAmount: Number(decryptData(encrypted.urgentAmount, uid)),
          bankBalance: Number(decryptData(encrypted.bankBalance, uid)),
          goals: parsedGoals,
          lang
        };
      } else {
        context = { lang };
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context })
      });

      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: data.reply }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: t.errorPleaseTryAgain }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[600px] transition-colors">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center justify-center">
          <Bot className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{t.assistantTitle}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.assistantSubtitle}</p>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg flex gap-2 items-center">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.assistantPlaceholder}
            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
