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
        ? "CRITICAL INSTRUCTION: You MUST ALWAYS reply in French. Be professional and concise."
        : "CRITICAL INSTRUCTION: You MUST ALWAYS reply in English. Be professional and concise.";

      const systemInstruction = `You are a helpful and smart budgeting assistant for the app "Smart Saver".
      ${langInstruction}
      
      The user's current financial context is provided below. Use this to give specific advice, 
      reminders, and encouragement about their goals, salary, and savings. Keep it short and helpful.
      
      Context:
      Monthly Salary: ${context.salary || 0}
      Monthly Urgent Expenses: ${context.urgentAmount || 0}
      Bank Balance: ${context.bankBalance || 0}
      Goals: ${JSON.stringify(context.goals || [])}
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
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
