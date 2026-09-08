const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  `const langInstruction = lang === 'fr' 
        ? "CRITICAL INSTRUCTION: You MUST ALWAYS reply in French. Be professional and concise."
        : "CRITICAL INSTRUCTION: You MUST ALWAYS reply in English. Be professional and concise.";`,
  `const langInstruction = lang === 'fr' 
        ? "CRITICAL INSTRUCTION: You MUST ALWAYS reply in French. Use French slang (verlan, wesh, frérot, le sang, etc)."
        : "CRITICAL INSTRUCTION: You MUST ALWAYS reply in English. Use English slang (bro, no cap, fr, etc).";`
);

fs.writeFileSync('server.ts', code);
