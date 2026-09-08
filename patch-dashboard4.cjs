const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  `const handleDeleteAccount = async () => {
    if (window.confirm(t.deleteAccountConfirm)) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteDoc(doc(db, 'users', user.uid));
          await setDoc(doc(db, 'stats', 'global'), { totalUsers: increment(-1) }, { merge: true });
          await deleteUser(user);
        }
      } catch (error: any) {
        console.error("Error deleting account:", error);
        if (error.code === 'auth/requires-recent-login') {
          alert(t.requiresRecentLogin);
          await auth.signOut();
        } else {
          alert(t.errorDeletingAccount);
        }
      }
    }
  };`,
  `const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid));
        await setDoc(doc(db, 'stats', 'global'), { totalUsers: increment(-1) }, { merge: true });
        await deleteUser(user);
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert(t.requiresRecentLogin);
        await auth.signOut();
      } else {
        alert(t.errorDeletingAccount);
      }
    }
  };`
);

code = code.replace(
  `<button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.deleteAccount}
          </button>`,
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
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="px-4 py-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.deleteAccount}
            </button>
          )}`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
