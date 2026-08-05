const fs = require('fs');
let code = fs.readFileSync('src/components/RosterTable.tsx', 'utf8');

const searchTargets = `  const shiftDetails = {`;
const replaceTargets = `  const targets = useMemo(() => {
    let A = 0, B = 0, C = 0;
    posts.forEach(p => {
      A += p.shiftCounts.A || 0;
      B += p.shiftCounts.B || 0;
      C += p.shiftCounts.C || 0;
    });
    return { A, B, C };
  }, [posts]);

  const shiftDetails = {`;
code = code.replace(searchTargets, replaceTargets);

if(!code.includes('useMemo')) {
    code = code.replace("import React from 'react';", "import React, { useMemo } from 'react';");
}

const searchCondition = `assignments.length === (shift === 'A' ? 12 : shift === 'B' ? 14 : 15)`;
const replaceCondition = `assignments.length === (shift === 'A' ? targets.A : shift === 'B' ? targets.B : targets.C)`;
code = code.split(searchCondition).join(replaceCondition);

const searchCondition2 = `assignments.length > (shift === 'A' ? 12 : shift === 'B' ? 14 : 15)`;
const replaceCondition2 = `assignments.length > (shift === 'A' ? targets.A : shift === 'B' ? targets.B : targets.C)`;
code = code.split(searchCondition2).join(replaceCondition2);

const searchCondition3 = `+\${assignments.length - (shift === 'A' ? 12 : shift === 'B' ? 14 : 15)} জন বেশি`;
const replaceCondition3 = `+\${assignments.length - (shift === 'A' ? targets.A : shift === 'B' ? targets.B : targets.C)} জন বেশি`;
code = code.split(searchCondition3).join(replaceCondition3);

const searchCondition4 = `\${(shift === 'A' ? 12 : shift === 'B' ? 14 : 15) - assignments.length} জন শর্ট`;
const replaceCondition4 = `\${(shift === 'A' ? targets.A : shift === 'B' ? targets.B : targets.C) - assignments.length} জন শর্ট`;
code = code.split(searchCondition4).join(replaceCondition4);

fs.writeFileSync('src/components/RosterTable.tsx', code);
