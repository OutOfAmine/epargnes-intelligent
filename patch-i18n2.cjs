const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Insert English translations
code = code.replace(
  `updateNumbersPrompt: "Update your numbers or add goals in your Profile.",`,
  `updateNumbersPrompt: "Update your numbers or add goals in your Profile.",
    savers: "Savers",
    dashboardGreeting: "Yoooooo",
    remixTitle: "Remix it ! make it strong if you can ! 🚀",
    remixDesc: "No licence is open source.",
    errorPleaseTryAgain: "Error. Please try again.",
    errorDeletingAccount: "Error deleting account. Please try again.",
    numbersMasked: "Numbers are currently masked for privacy.",
    unallocated: "Unallocated",
    distribution: "(Distribution)",`
);

// Insert French translations
code = code.replace(
  `updateNumbersPrompt: "Mettez à jour vos chiffres ou ajoutez des objectifs dans votre Profil.",`,
  `updateNumbersPrompt: "Mettez à jour vos chiffres ou ajoutez des objectifs dans votre Profil.",
    savers: "Épargnants",
    dashboardGreeting: "Yoooooo",
    remixTitle: "Remixez-le ! Rendez-le meilleur si vous le pouvez ! 🚀",
    remixDesc: "Aucune licence n'est open source.",
    errorPleaseTryAgain: "Erreur. Veuillez réessayer.",
    errorDeletingAccount: "Erreur lors de la suppression. Veuillez réessayer.",
    numbersMasked: "Les chiffres sont masqués par souci de confidentialité.",
    unallocated: "Non alloué",
    distribution: "(Répartition)",`
);

fs.writeFileSync('src/lib/i18n.ts', code);
