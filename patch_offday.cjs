const fs = require('fs');
let code = fs.readFileSync('src/utils/rosterAlgorithm.ts', 'utf8');

code = code.replace(
    /assignedPost: sc\.targetPost \|\| 'অস্থায়ী ডিউটি',(\s*)isShiftChange: true,/g,
    "assignedPost: sc.targetPost || 'অস্থায়ী ডিউটি',\n              offDay: staff.offDay,$1isShiftChange: true,"
);

fs.writeFileSync('src/utils/rosterAlgorithm.ts', code);
