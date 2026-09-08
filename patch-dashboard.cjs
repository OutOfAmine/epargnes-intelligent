const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  `{isConfirmingDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>`,
  `{isConfirmingDelete ? (
            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
              <p className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50 animate-in fade-in slide-in-from-right-4">
                {t.deleteAccountConfirm}
              </p>
              <div className="flex items-center gap-2 self-end">
                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  Nah, I'm staying
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-red-500/20"
                >
                  SEND IT 🚀
                </button>
              </div>
            </div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
