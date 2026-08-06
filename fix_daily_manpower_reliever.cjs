const fs = require('fs');

let content = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

const search = `                 if (replacedShift) {
                     result[idx][replacedShift]++;
                 } else {
                     if (['A', 'B', 'C'].includes(activeEntry.assignedShift)) {
                         result[idx][activeEntry.assignedShift as 'A' | 'B' | 'C']++;
                     }
                 }`;

const replace = `                 if (!replacedShift) {
                     const shiftMatch = (s.subSection || '').match(/Shift-\\s*([ABC])/i);
                     if (shiftMatch) {
                         replacedShift = shiftMatch[1].toUpperCase() as 'A' | 'B' | 'C';
                     } else {
                         const sub = (s.subSection || '').toLowerCase();
                         if (sub.includes('agro') || sub.includes('yarn')) {
                             replacedShift = 'A';
                         } else if (sub.includes('r-cotton')) {
                             replacedShift = 'C';
                         } else {
                             // Fallback
                             replacedShift = 'A';
                         }
                     }
                 }
                 
                 if (replacedShift) {
                     result[idx][replacedShift]++;
                 } else {
                     if (['A', 'B', 'C'].includes(activeEntry.assignedShift)) {
                         result[idx][activeEntry.assignedShift as 'A' | 'B' | 'C']++;
                     }
                 }`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('src/components/DailyManpowerStatus.tsx', content);
    console.log("Fixed DailyManpowerStatus");
} else {
    console.log("Could not find block in DailyManpowerStatus");
}
