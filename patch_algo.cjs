const fs = require('fs');
let code = fs.readFileSync('src/utils/rosterAlgorithm.ts', 'utf8');

const search = `  // Distribute remaining relievers to hit exact targets: A (12), B (14), C (16)
  const TARGET_A = 12;
  const TARGET_B = 14;
  const TARGET_C = 15;`;

const replace = `  // Distribute remaining relievers to hit exact targets based on post requirements
  let TARGET_A = 0, TARGET_B = 0, TARGET_C = 0;
  postRequirements.forEach(p => {
    TARGET_A += p.shiftCounts.A || 0;
    TARGET_B += p.shiftCounts.B || 0;
    TARGET_C += p.shiftCounts.C || 0;
  });`;

code = code.replace(search, replace);

fs.writeFileSync('src/utils/rosterAlgorithm.ts', code);
