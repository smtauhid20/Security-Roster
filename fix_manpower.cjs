const fs = require('fs');

let content = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

content = content.replace(
  `const dayAssignments = new Map<string, Staff[]>();`,
  `const dayAssignments = new Map<string, Staff[]>();\n      const assignedThisDay = new Set<string>();`
);

content = content.replace(
  `for (let i = unassignedOffStaff.length - 1; i >= 0; i--) {
              const s = unassignedOffStaff[i];`,
  `for (let i = unassignedOffStaff.length - 1; i >= 0; i--) {
              const s = unassignedOffStaff[i];
              if (assignedThisDay.has(s.id)) continue;`
);

content = content.replace(
  `if (matches) {
                 covered.push(s);
                 unassignedOffStaff.splice(i, 1);
              }`,
  `if (matches) {
                 covered.push(s);
                 assignedThisDay.add(s.id);
                 unassignedOffStaff.splice(i, 1);
              }`
);

fs.writeFileSync('src/components/DailyManpowerStatus.tsx', content);
