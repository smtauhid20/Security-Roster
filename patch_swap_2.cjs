const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveOTManager.tsx', 'utf8');

const search = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      const g = (s.permanentGroup || '').trim();
      if (g === 'Reliever') return 'General';
      if (['A', 'B', 'C', 'General'].includes(g)) return g as ShiftType;
      return 'General';
    };`;

const replace = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      const g = (s.permanentGroup || '').trim();
      if (g.toLowerCase() === 'reliever') return 'General';
      if (g.toUpperCase() === 'A') return 'A';
      if (g.toUpperCase() === 'B') return 'B';
      if (g.toUpperCase() === 'C') return 'C';
      if (g.toLowerCase() === 'general') return 'General';
      return 'General';
    };`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/LeaveOTManager.tsx', code);
