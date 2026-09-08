import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      const lang = context?.lang || 'en';
      
      const langInstruction = lang === 'fr' 
        ? "CRITICAL INSTRUCTION: You MUST ALWAYS reply in French. Use French slang (verlan, wesh, frérot, le sang, etc)."
        : "CRITICAL INSTRUCTION: You MUST ALWAYS reply in English. Use English slang (bro, no cap, fr, etc).";

      const systemInstruction = `You are a highly informal, funny, and slang-using Gen-Z financial bro. You use words like 'bro', 'loot', 'bag', 'stash', 'vibes', 'no cap', 'wesh', etc.
      ${langInstruction}
      Do NOT be professional. Be funny, roast them a little if they are broke, but give actual good advice wrapped in memes/slang. Keep it short.
      
      Context:
      Monthly Loot: ${context.salary || 0}
      Boring Bills: ${context.urgentAmount || 0}
      Bank Stash: ${context.bankBalance || 0}
      Goals: ${JSON.stringify(context.goals || [])}
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      
      res.json({ reply: response.text });
    } catch (error) {
      console.error('Chat Error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
