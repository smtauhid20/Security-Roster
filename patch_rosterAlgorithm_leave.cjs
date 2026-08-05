const fs = require('fs');
let code = fs.readFileSync('src/utils/rosterAlgorithm.ts', 'utf8');

const searchLeave = `    if (replacementId && leave.shiftType && leave.postName) {
      const replacementStaff = allStaff.find(s => s.id === replacementId);
      if (replacementStaff && !onLeaveIds.has(replacementStaff.id)) {
        // Remove from normal pool
        (['A', 'B', 'C', 'General'] as ShiftType[]).forEach(shift => {
          const idx = shiftPools[shift].findIndex(s => s.id === replacementStaff.id);
          if (idx !== -1) shiftPools[shift].splice(idx, 1);
        });
        
        roster.push({
          staffId: replacementStaff.id,
          staffName: replacementStaff.name,
          role: replacementStaff.role,
          permanentGroup: replacementStaff.permanentGroup,
          assignedShift: leave.shiftType,
          assignedPost: leave.postName,
          isReplacement: true
        });
        
        // Temporarily reduce the requirement count for this specific post/shift combination
        const req = postRequirements.find(p => p.name === leave.postName);
        if (req && req.shiftCounts[leave.shiftType] > 0) {
           // We mutate a copy if we want to be pure, but since we map inside assignPostsForShift, 
           // we can just let it assign one less. Let's handle it strictly in assignPostsForShift by tracking assigned counts.
        }
      }
    }`;

const replaceLeave = `    if (replacementId && leave.shiftType && leave.postName) {
      const replacementStaff = allStaff.find(s => s.id === replacementId);
      if (replacementStaff && !onLeaveIds.has(replacementStaff.id)) {
        // Find actual running shift for the leave
        const targetGroup = leave.shiftType;
        const actualRunningShift = targetGroup === 'General' ? 'General' : getAssignedShift(targetGroup as PermanentGroup);

        // Remove from normal pool
        (['A', 'B', 'C', 'General'] as ShiftType[]).forEach(shift => {
          const idx = shiftPools[shift].findIndex(s => s.id === replacementStaff.id);
          if (idx !== -1) shiftPools[shift].splice(idx, 1);
        });
        
        roster.push({
          staffId: replacementStaff.id,
          staffName: replacementStaff.name,
          role: replacementStaff.role,
          permanentGroup: replacementStaff.permanentGroup,
          assignedShift: actualRunningShift,
          assignedPost: leave.postName,
          isReplacement: true
        });
      }
    }`;

code = code.replace(searchLeave, replaceLeave);
fs.writeFileSync('src/utils/rosterAlgorithm.ts', code);
