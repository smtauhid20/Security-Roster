const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

// Fixing any trailing spaces issue for offDay just to be safe
const search = `if (s.offDay !== day) return false;`;
const replace = `if (String(s.offDay || '').trim().toLowerCase() !== day.toLowerCase()) return false;`;

if (code.includes(search)) {
    code = code.replace(search, replace);
}

const search2 = `if (r.offDay === day) {`;
const replace2 = `if (String(r.offDay || '').trim().toLowerCase() === day.toLowerCase()) {`;

if (code.includes(search2)) {
    code = code.replace(search2, replace2);
}

fs.writeFileSync('src/components/RelieverManager.tsx', code);
