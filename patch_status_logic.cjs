const fs = require('fs');
let code = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

const searchManpower = `  const dailyManpower = useMemo(() => {
    const result = days.map(day => ({ 
       iso: day.iso, 
       nameBn: day.nameBn, 
       A: 0, B: 0, C: 0 
     }));
     
    roster.forEach(r => {
      days.forEach((day, idx) => {
        const dayTime = day.date.getTime();
        let isValidToday = true;

        if (r.assignedShift === 'Leave') {
          isValidToday = false;
        }

        if (isValidToday && r.offDay && r.offDay.trim().toLowerCase() === day.dayStr.toLowerCase()) {
          isValidToday = false;
        }

        if (isValidToday && r.leaveStartDate) {
          const lStart = new Date(r.leaveStartDate).getTime();
          const lEnd = r.leaveEndDate ? new Date(r.leaveEndDate).getTime() : Infinity;
          if (dayTime >= lStart && dayTime <= lEnd) {
            isValidToday = false;
          }
        }

        if (isValidToday && r.isShiftChange && r.shiftChangeDates) {
          const sMatch = r.shiftChangeDates.match(/\\d{4}-\\d{2}-\\d{2}/g);
          if (sMatch && sMatch.length >= 1) {
            const sTime = new Date(sMatch[0]).getTime();
            const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
            // Add a 12-hour buffer to handle time zone issues
            // Just comparing timestamps of start of day is fine since we parsed YYYY-MM-DD
            const isShiftChangeActiveToday = (dayTime >= sTime && dayTime <= eTime);
            
            if (r.shiftChangeDates.includes('শিফট)')) {
              if (isShiftChangeActiveToday) isValidToday = false;
            } else {
              if (!isShiftChangeActiveToday) isValidToday = false;
            }
          }
        }

        if (isValidToday) {
          if (r.assignedShift === 'A' || r.assignedShift === 'B' || r.assignedShift === 'C') {
            result[idx][r.assignedShift]++;
          }
        }
      });
    });
    
    return result;
  }, [roster, days]);`;

const replaceManpower = `  const dailyManpower = useMemo(() => {
    const result = days.map(day => ({ 
       iso: day.iso, 
       nameBn: day.nameBn, 
       A: 0, B: 0, C: 0 
     }));

    const extractPostNumbers = (str: string): string[] => {
       const nums: string[] = [];
       const regex = /(?:post|rg)[-\\s]*([\\d\\s,&and]+)/gi;
       let match;
       while ((match = regex.exec(str)) !== null) {
           const extracted = match[1].match(/\\d+/g);
           if (extracted) {
               const prefix = match[0].toLowerCase().includes('rg') ? 'rg' : 'post';
               nums.push(...extracted.map(n => prefix + '-' + parseInt(n).toString()));
           }
       }
       if (nums.length === 0) {
           const allNums = str.match(/\\d+/g);
           if (allNums && str.toLowerCase().includes('post')) {
               nums.push(...allNums.map(n => 'post-' + parseInt(n).toString()));
           }
       }
       return nums;
    };

    staff.forEach(s => {
      // Find their roster entries
      const rEntries = roster.filter(r => r.staffId === s.id);
      
      days.forEach((day, idx) => {
        const dayTime = day.date.getTime();
        let activeEntry = rEntries.find(r => {
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
        }) || rEntries[0];

        if (!activeEntry) return; // Should not happen if they are in roster

        // Check if they are off today (Off day or Leave)
        let isOff = false;
        if (activeEntry.assignedShift === 'Leave') isOff = true;
        if (activeEntry.offDay && activeEntry.offDay.trim().toLowerCase() === day.dayStr.toLowerCase()) isOff = true;
        if (activeEntry.leaveStartDate) {
          const lStart = new Date(activeEntry.leaveStartDate).getTime();
          const lEnd = activeEntry.leaveEndDate ? new Date(activeEntry.leaveEndDate).getTime() : Infinity;
          if (dayTime >= lStart && dayTime <= lEnd) isOff = true;
        }

        if (!isOff) {
          // If they are not a Reliever, just count their assigned shift
          if (s.permanentGroup !== 'Reliever') {
            if (activeEntry.assignedShift === 'A' || activeEntry.assignedShift === 'B' || activeEntry.assignedShift === 'C') {
               result[idx][activeEntry.assignedShift]++;
            }
          } else {
            // Reliever Logic: See who they replace today
            // Find all staff who are OFF today
            const offStaff = staff.filter(os => {
               if (os.id === s.id) return false;
               if (os.permanentGroup === 'Reliever') return false; // Ignore off relievers for replacement
               if (String(os.offDay || '').trim().toLowerCase() !== day.dayStr.toLowerCase()) return false;
               return true;
            });

            // See if this reliever replaces any of the offStaff
            let replacedShift: 'A' | 'B' | 'C' | null = null;
            const rSub = (s.subSection || '').toLowerCase();
            const rTags = extractPostNumbers(rSub);

            for (const os of offStaff) {
               const sSub = (os.subSection || '').toLowerCase();
               const sTags = extractPostNumbers(sSub);
               let matches = false;
               if (s.role === 'LadyGuard' && os.role === 'LadyGuard') matches = true;
               else if (s.role === 'Supervisor' && os.role === 'Supervisor') matches = true;
               else if (sTags.length > 0 && rTags.length > 0 && sTags.some(tag => rTags.includes(tag))) matches = true;
               else if (sTags.length === 0 && rTags.length === 0 && rSub && sSub && (rSub.includes(sSub) || sSub.includes(rSub)) && sSub.length > 3) matches = true;

               if (!matches) {
                   const supportedPosts = posts.filter(p => {
                      const initialPost = initialPosts.find(ip => ip.id === p.id);
                      const supports = p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
                      return supports.includes(s.id);
                   });
                   matches = supportedPosts.some(p => {
                      const pTags = extractPostNumbers(p.name);
                      if (sTags.length > 0 && pTags.length > 0 && sTags.some(tag => pTags.includes(tag))) return true;
                      const pName = p.name.toLowerCase();
                      return sSub.includes(pName) || pName.includes(sSub);
                   });
               }

               if (matches) {
                  // Find os's shift
                  let osShift = os.permanentGroup; // Default
                  // If os had a shift change, check it
                  const osEntries = roster.filter(r => r.staffId === os.id);
                  let osActiveEntry = osEntries.find(r => {
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
                  }) || osEntries[0];
                  
                  if (osActiveEntry && ['A', 'B', 'C'].includes(osActiveEntry.assignedShift)) {
                     replacedShift = osActiveEntry.assignedShift as 'A' | 'B' | 'C';
                     break; // Found replacement
                  }
               }
            }

            if (replacedShift) {
               result[idx][replacedShift]++;
            } else {
               // If they don't replace anyone today (or we couldn't match), fallback to their artificial assigned shift in roster
               if (activeEntry.assignedShift === 'A' || activeEntry.assignedShift === 'B' || activeEntry.assignedShift === 'C') {
                  result[idx][activeEntry.assignedShift]++;
               }
            }
          }
        }
      });
    });
    
    return result;
  }, [roster, days, staff, posts]);`;

code = code.replace(searchManpower, replaceManpower);

fs.writeFileSync('src/components/DailyManpowerStatus.tsx', code);
