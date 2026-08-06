const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

code = code.replace(`const extractPostNumbers = (str) => {`, `const extractPostNumbers = (str: string): string[] => {`);

fs.writeFileSync('src/components/RelieverManager.tsx', code);
