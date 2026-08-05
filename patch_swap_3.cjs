const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveOTManager.tsx', 'utf8');

const search = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      const g = (s.permanentGroup || '').trim();
      if (g.toLowerCase() === 'reliever') return 'General';
      if (g.toUpperCase() === 'A') return 'A';
      if (g.toUpperCase() === 'B') return 'B';
      if (g.toUpperCase() === 'C') return 'C';
      if (g.toLowerCase() === 'general') return 'General';
      return 'General';
    };`;

const replace = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      const g = String(s.permanentGroup || '').trim().toUpperCase();
      if (g.includes('RELIEVER')) return 'General';
      if (g === 'A' || g.includes('GROUP A') || g.includes(' A')) return 'A';
      if (g === 'B' || g.includes('GROUP B') || g.includes(' B')) return 'B';
      if (g === 'C' || g.includes('GROUP C') || g.includes(' C')) return 'C';
      if (g.includes('GENERAL')) return 'General';
      // Fallback: check if the string simply contains A, B, or C as a standalone word
      if (/\\bA\\b/.test(g)) return 'A';
      if (/\\bB\\b/.test(g)) return 'B';
      if (/\\bC\\b/.test(g)) return 'C';
      
      return 'General';
    };`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/LeaveOTManager.tsx', code);
