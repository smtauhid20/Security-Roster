const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveOTManager.tsx', 'utf8');

const search = `    const targetShiftFor1 = staff2 ? (staff2.permanentGroup === 'Reliever' ? 'General' : (['A', 'B', 'C', 'General'].includes(staff2.permanentGroup) ? staff2.permanentGroup as ShiftType : changeTargetShift)) : changeTargetShift;
    const targetShiftFor2 = staff1 ? (staff1.permanentGroup === 'Reliever' ? 'General' : (['A', 'B', 'C', 'General'].includes(staff1.permanentGroup) ? staff1.permanentGroup as ShiftType : 'General')) : 'General';`;

const replace = `    const getShift = (s: Staff | undefined | null) => {
      if (!s) return 'General';
      const g = (s.permanentGroup || '').trim();
      if (g === 'Reliever') return 'General';
      if (['A', 'B', 'C', 'General'].includes(g)) return g as ShiftType;
      return 'General';
    };

    const targetShiftFor1 = staff2 ? getShift(staff2) : changeTargetShift;
    const targetShiftFor2 = staff1 ? getShift(staff1) : 'General';`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/LeaveOTManager.tsx', code);
