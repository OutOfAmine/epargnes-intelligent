const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

// Replace card container style
code = code.replace(
  `      <div className="max-w-sm w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">`,
  `      <div className="max-w-sm w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 text-center shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300 hover:shadow-2xl">`
);

// Replace button style
code = code.replace(
  `          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center space-x-3"`,
  `          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-3"`
);

// Update strings to use translations
code = code.replace(
  `            <span>Join {totalUsers} savers trusting this app!</span>`,
  `            <span>{t.joinPrefix} {totalUsers} {t.joinSuffix}</span>`
);

code = code.replace(
  `            👋 Yoooo, come on!
          </p>`,
  `            {t.authorGreeting}
          </p>`
);

code = code.replace(
  `            I'm Amine Jerrary, the developer behind this app. I built this tool to help you secure and master your budget like a pro! Everything is encrypted on your side. Let's get started. 🚀
          </p>`,
  `            {t.authorIntro}
          </p>`
);

fs.writeFileSync('src/components/Login.tsx', code);
