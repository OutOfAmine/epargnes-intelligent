const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// French specific short versions
code = code.replace(
  `deleteAccount: "Supprimer le compte définitivement",`,
  `deleteAccount: "Supprimer le compte",`
);

code = code.replace(
  `joinSuffix: "épargnants qui font confiance à cette application !",`,
  `joinSuffix: "épargnants !",`
);

code = code.replace(
  `authorIntro: "Je suis Amine Jerrary, le développeur de cette application. J'ai créé cet outil pour vous aider à sécuriser et maîtriser votre budget comme un pro ! Tout est chiffré de votre côté. Allons-y 🚀",`,
  `authorIntro: "Je suis Amine Jerrary. Maîtrisez votre budget comme un pro, tout est chiffré de votre côté ! 🚀",`
);

fs.writeFileSync('src/lib/i18n.ts', code);
