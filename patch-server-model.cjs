const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(`model: 'gemini-3.1-pro-preview',`, `model: 'gemini-2.5-flash',`);
fs.writeFileSync('server.ts', code);
