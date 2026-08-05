const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

const search = `                        if (s.offDay !== day) return false;`;
const replace = `                        if (String(s.offDay || '').trim().toLowerCase() !== day.toLowerCase()) return false;`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/RelieverManager.tsx', code);
