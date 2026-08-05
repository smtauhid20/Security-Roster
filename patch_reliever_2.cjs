const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

const search = `                      if (r.offDay === day) {`;
const replace = `                      if (String(r.offDay || '').trim().toLowerCase() === day.toLowerCase()) {`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/RelieverManager.tsx', code);
