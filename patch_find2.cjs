const fs = require('fs');
let code = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

const search2 = `                  let osActiveEntry = osEntries.find(r => {
                     if (!r.isShiftChange) return true;
                     if (!r.shiftChangeDates) return true;
                     const sMatch = r.shiftChangeDates.match(/\\d{4}-\\d{2}-\\d{2}/g);
                     if (sMatch && sMatch.length >= 1) {
                        const sTime = new Date(sMatch[0]).getTime();
                        const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
                        const isActive = (dayTime >= sTime && dayTime <= eTime);
                        return r.shiftChangeDates.includes('শিফট)') ? !isActive : isActive;
                     }
                     return true;
                  }) || osEntries[0];`;

const replace2 = `                  let osActiveEntry = osEntries.find(r => {
                     if (r.isShiftChange && r.shiftChangeDates) {
                        const sMatch = r.shiftChangeDates.match(/\\d{4}-\\d{2}-\\d{2}/g);
                        if (sMatch && sMatch.length >= 1) {
                           const sTime = new Date(sMatch[0]).getTime();
                           const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
                           const isActive = (dayTime >= sTime && dayTime <= eTime);
                           return r.shiftChangeDates.includes('শিফট)') ? !isActive : isActive;
                        }
                     }
                     return false;
                  });
                  if (!osActiveEntry) {
                      osActiveEntry = osEntries.find(r => !r.isShiftChange || (r.isShiftChange && r.shiftChangeDates && r.shiftChangeDates.includes('শিফট)'))) || osEntries[0];
                  }`;

code = code.replace(search2, replace2);
fs.writeFileSync('src/components/DailyManpowerStatus.tsx', code);
