const fs = require('fs');

// Patch types.ts
let typesStr = fs.readFileSync('src/types.ts', 'utf8');
typesStr = typesStr.replace(
  "isShiftChange?: boolean;",
  "isShiftChange?: boolean;\n  leaveStartDate?: string;\n  leaveEndDate?: string;"
);
fs.writeFileSync('src/types.ts', typesStr);

// Patch rosterAlgorithm.ts
let rosterCode = fs.readFileSync('src/utils/rosterAlgorithm.ts', 'utf8');
// Find where we push leave assignments
rosterCode = rosterCode.replace(
  "assignedPost: 'সাপ্তাহিক ছুটি / অনুপস্থিত'",
  "assignedPost: 'সাপ্তাহিক ছুটি / অনুপস্থিত',\n        leaveStartDate: weekLeaves.find(l => l.staffId === staff.id)?.startDate,\n        leaveEndDate: weekLeaves.find(l => l.staffId === staff.id)?.endDate"
);
fs.writeFileSync('src/utils/rosterAlgorithm.ts', rosterCode);
