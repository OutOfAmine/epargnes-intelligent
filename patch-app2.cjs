const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `Remix it ! make it strong if you can ! 🚀`,
  `{t.remixTitle}`
);

code = code.replace(
  `No licence is open source.`,
  `{t.remixDesc}`
);

fs.writeFileSync('src/App.tsx', code);
