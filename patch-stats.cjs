const fs = require('fs');
let code = fs.readFileSync('src/components/Stats.tsx', 'utf8');

code = code.replace(
  `Numbers are currently masked for privacy.`,
  `{t.numbersMasked}`
);

code = code.replace(
  `{ name: 'Unallocated', value: data.bankBalance }`,
  `{ name: t.unallocated, value: data.bankBalance }`
);

code = code.replace(
  `{t.myGoals} (Distribution)`,
  `{t.myGoals} {t.distribution}`
);

fs.writeFileSync('src/components/Stats.tsx', code);
