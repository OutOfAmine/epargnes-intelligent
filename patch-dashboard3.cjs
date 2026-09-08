const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  `auth.currentUser?.displayName || 'Savers'`,
  `auth.currentUser?.displayName || t.savers`
);

code = code.replace(
  `Yoooooo {displayName}`,
  `{t.dashboardGreeting} {displayName}`
);

code = code.replace(
  `alert("Error deleting account. Please try again.");`,
  `alert(t.errorDeletingAccount);`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
