const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetFooter = `<p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            Remix it ! make it strong if you can ! 🚀
          </p>`;

const replacementFooter = `<a href="https://github.com/OutOfAmine/epargnes-intelligent" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
            Remix it ! make it strong if you can ! 🚀
          </a>`;

code = code.replace(targetFooter, replacementFooter);

fs.writeFileSync('src/App.tsx', code);
