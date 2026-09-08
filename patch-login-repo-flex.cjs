const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

// The layout right now puts the repo link above the card. Let's make it look nice and centered on the whole screen wrapper. 
// "min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors duration-300 relative"
// Because it's flex items-center, it might stretch weirdly if we just have two siblings (repo link + card) without a wrapper column.
code = code.replace(
  `      <div className="max-w-md w-full mx-auto mt-8 mb-4 text-center">`,
  `      <div className="w-full flex flex-col items-center justify-center space-y-6">
        <div className="max-w-md w-full mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 text-center shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300 hover:shadow-2xl">`
);

// We need to move the github link *below* the card. So let's undo the previous replace and do it right.
