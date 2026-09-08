const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  `        if (user) {
          await deleteDoc(doc(db, 'users', user.uid));
          await deleteUser(user);
        }`,
  `        if (user) {
          await deleteDoc(doc(db, 'users', user.uid));
          const statsRef = doc(db, 'stats', 'global');
          await setDoc(statsRef, { totalUsers: increment(-1) }, { merge: true });
          await deleteUser(user);
        }`
);

// We also need to import setDoc if it's not imported.
if (!code.includes('setDoc')) {
  code = code.replace('deleteDoc, increment', 'deleteDoc, increment, setDoc');
}

code = code.replace(
  `        if (error.code === 'auth/requires-recent-login') {
          alert(t.requiresRecentLogin);
        }`,
  `        if (error.code === 'auth/requires-recent-login') {
          alert(t.requiresRecentLogin);
          await auth.signOut();
        }`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
