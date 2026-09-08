const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

code = code.replace(
  `joinSuffix: "savers trusting this app!",`,
  `joinSuffix: "savers trusting this app!",
    loginRepoLinkTitle: "Remix it on GitHub",
    loginRepoLinkDesc: "Run locally or build your own version",`
);

code = code.replace(
  `joinSuffix: "épargnants !",`,
  `joinSuffix: "épargnants !",
    loginRepoLinkTitle: "Remixez le projet sur GitHub",
    loginRepoLinkDesc: "Hébergez-le localement ou créez votre propre version",`
);

fs.writeFileSync('src/lib/i18n.ts', code);
