const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

code = code.replace(
  `"Error. Please try again."`,
  `t.errorPleaseTryAgain`
);

fs.writeFileSync('src/components/Chatbot.tsx', code);
