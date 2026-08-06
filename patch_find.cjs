const fs = require('fs');
let code = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

const search = `        let activeEntry = rEntries.find(r => {
           if (!r.isShiftChange) return true;
           if (!r.shiftChangeDates) return true;
           const sMatch = r.shiftChangeDates.match(/\\d{4}-\\d{2}-\\d{2}/g);
           if (sMatch && sMatch.length >= 1) {
              const sTime = new Date(sMatch[0]).getTime();
              const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
              const isActive = (dayTime >= sTime && dayTime <= eTime);
              if (r.shiftChangeDates.includes('শিফট)')) {
                 return !isActive; // Normal shift is NOT active during shift change dates
              } else {
                 return isActive; // Changed shift IS active during shift change dates
              }
           }
           return true;
        }) || rEntries[0];`;

const replace = `        let activeEntry = rEntries.find(r => {
           if (r.isShiftChange && r.shiftChangeDates) {
               const sMatch = r.shiftChangeDates.match(/\\d{4}-\\d{2}-\\d{2}/g);
               if (sMatch && sMatch.length >= 1) {
                  const sTime = new Date(sMatch[0]).getTime();
                  const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
                  const isActive = (dayTime >= sTime && dayTime <= eTime);
                  if (r.shiftChangeDates.includes('শিফট)')) {
                     return !isActive; 
                  } else {
                     return isActive; 
                  }
               }
           }
           return false;
        });
        
        if (!activeEntry) {
            activeEntry = rEntries.find(r => !r.isShiftChange || (r.isShiftChange && r.shiftChangeDates && r.shiftChangeDates.includes('শিফট)'))) || rEntries[0];
        }`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/DailyManpowerStatus.tsx', code);
