const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

if (code.includes(`import { deleteDoc, increment } from 'firebase/firestore';`)) {
  code = code.replace(
    `import { deleteDoc, increment } from 'firebase/firestore';`,
    `import { deleteDoc, increment, setDoc } from 'firebase/firestore';`
  );
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
