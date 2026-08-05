const fs = require('fs');
let code = fs.readFileSync('src/utils/rosterAlgorithm.ts', 'utf8');

const search = `    } else if (changedShiftMap.has(staff.id)) {
      const targetShift = changedShiftMap.get(staff.id)!;
      if (['A', 'B', 'C', 'General', 'Reliever'].includes(targetShift)) {
        if (targetShift === 'Reliever') {
          relievers.push(staff);
        } else {
          shiftPools[targetShift].push(staff);
        }
      }
    } else if (staff.permanentGroup === 'Reliever') {`;

const replace = `    } else if (changedShiftMap.has(staff.id)) {
      const targetGroup = changedShiftMap.get(staff.id)!;
      if (['A', 'B', 'C', 'General', 'Reliever'].includes(targetGroup)) {
        if (targetGroup === 'Reliever') {
          relievers.push(staff);
        } else if (targetGroup === 'General') {
          shiftPools.General.push(staff);
        } else {
          const assignedShift = getAssignedShift(targetGroup as PermanentGroup);
          shiftPools[assignedShift].push(staff);
        }
      }
    } else if (staff.permanentGroup === 'Reliever') {`;

code = code.replace(search, replace);
fs.writeFileSync('src/utils/rosterAlgorithm.ts', code);
