const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  `className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-3"`,
  `className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-3 cursor-pointer"`
);

fs.writeFileSync('src/components/Login.tsx', code);
