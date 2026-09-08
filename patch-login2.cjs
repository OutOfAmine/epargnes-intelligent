const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

// Fix responsiveness of the badge
code = code.replace(
  `w-max mx-auto border`,
  `w-fit max-w-full mx-auto border flex-wrap text-center`
);

// Make the card slightly larger for breathing room
code = code.replace(
  `max-w-sm w-full`,
  `max-w-md w-full mx-auto`
);

fs.writeFileSync('src/components/Login.tsx', code);
