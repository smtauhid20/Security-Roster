const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveOTManager.tsx', 'utf8');

const search = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      
      // Fallback manual hardcode for Junaid and Shamananda based on user request if IDs match
      if (s.id === '315589') return 'C';
      if (s.id === '313537') return 'B';
      
      const g = String(s.permanentGroup || '').trim().toUpperCase();
      if (g.includes('RELIEVER') || g.includes('রিলেভার')) return 'General';
      if (g === 'A' || g.includes('GROUP A') || g.includes(' A') || g.includes('এ')) return 'A';
      if (g === 'B' || g.includes('GROUP B') || g.includes(' B') || g.includes('বি')) return 'B';
      if (g === 'C' || g.includes('GROUP C') || g.includes(' C') || g.includes('সি')) return 'C';
      if (g.includes('GENERAL') || g.includes('জেনারেল')) return 'General';
      
      if (/\\bA\\b/.test(g)) return 'A';
      if (/\\bB\\b/.test(g)) return 'B';
      if (/\\bC\\b/.test(g)) return 'C';
      
      return 'General';
    };`;

const replace = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      
      const name = (s.name || '').toLowerCase();
      if (name.includes('junaid')) return 'C';
      if (name.includes('shamananda')) return 'B';
      
      const g = String(s.permanentGroup || '').trim().toUpperCase();
      if (g.includes('RELIEVER') || g.includes('রিলেভার')) return 'General';
      if (g === 'A' || g.includes('GROUP A') || g.includes(' A') || g.includes('এ')) return 'A';
      if (g === 'B' || g.includes('GROUP B') || g.includes(' B') || g.includes('বি')) return 'B';
      if (g === 'C' || g.includes('GROUP C') || g.includes(' C') || g.includes('সি')) return 'C';
      if (g.includes('GENERAL') || g.includes('জেনারেল')) return 'General';
      
      if (/\\bA\\b/.test(g)) return 'A';
      if (/\\bB\\b/.test(g)) return 'B';
      if (/\\bC\\b/.test(g)) return 'C';
      
      return g as ShiftType || 'General';
    };`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/LeaveOTManager.tsx', code);
