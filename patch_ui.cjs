const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveOTManager.tsx', 'utf8');

const search = `<span className="font-medium">{s1?.name}</span> যাবে <span className="font-bold text-indigo-600">{sc.targetShift}</span> শিফটে`;
const replace = `<span className="font-medium">{s1?.name} ({s1?.permanentGroup})</span> যাবে <span className="font-bold text-indigo-600">{sc.targetShift}</span> শিফটে`;

const search2 = `<span className="font-medium">{s2.name}</span> যাবে <span className="font-bold text-indigo-600">{sc.swappedFromShift}</span> শিফটে`;
const replace2 = `<span className="font-medium">{s2.name} ({s2.permanentGroup})</span> যাবে <span className="font-bold text-indigo-600">{sc.swappedFromShift}</span> শিফটে`;

code = code.replace(search, replace).replace(search2, replace2);
fs.writeFileSync('src/components/LeaveOTManager.tsx', code);
