import React, { useMemo } from 'react';
import { RosterAssignment, PostRequirement, Staff } from '../types';
import { postRequirements as initialPosts } from '../data';

interface Props {
  roster: RosterAssignment[];
  startDate: string;
  posts: PostRequirement[];
  staff: Staff[];
}

export const DailyManpowerStatus: React.FC<Props> = ({ roster, startDate, posts, staff }) => {
  const days = useMemo(() => {
    const start = new Date(startDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        iso: d.toISOString().split('T')[0],
        date: d,
        nameBn: d.toLocaleDateString('bn-BD', { weekday: 'short' }),
        dayStr: d.toLocaleDateString('en-US', { weekday: 'long' })
      };
    });
  }, [startDate]);

  const targets = useMemo(() => {
    let A = 0, B = 0, C = 0;
    posts.forEach(p => {
      A += p.shiftCounts.A || 0;
      B += p.shiftCounts.B || 0;
      C += p.shiftCounts.C || 0;
    });
    return { A, B, C };
  }, [posts]);

  const dailyManpower = useMemo(() => {
    const result = days.map(day => ({ 
       iso: day.iso, 
       nameBn: day.nameBn, 
       A: 0, B: 0, C: 0 
     }));

    const extractPostNumbers = (str: string): string[] => {
       const nums: string[] = [];
       const regex = /(?:post|rg)[-\s]*([\d\s,&and]+)/gi;
       let match;
       while ((match = regex.exec(str)) !== null) {
           const extracted = match[1].match(/\d+/g);
           if (extracted) {
               const prefix = match[0].toLowerCase().includes('rg') ? 'rg' : 'post';
               nums.push(...extracted.map(n => prefix + '-' + parseInt(n, 10).toString()));
           }
       }
       if (nums.length === 0) {
           const allNums = str.match(/\d+/g);
           if (allNums && str.toLowerCase().includes('post')) {
               nums.push(...allNums.map(n => 'post-' + parseInt(n, 10).toString()));
           }
       }
       return nums;
    };

    // Pre-compute reliever assignments to prevent double counting
    const relievers = staff.filter(s => {
      const rEntries = roster.filter(r => r.staffId === s.id);
      if (rEntries.length === 0) return false;
      const baseEntry = rEntries.find(r => !r.isShiftChange && !r.isReplacement) || rEntries[0];
      const shiftChangeEntry = rEntries.find(r => r.isShiftChange);
      if (shiftChangeEntry) return shiftChangeEntry.assignedShift === 'Reliever';
      return baseEntry.assignedShift === 'Reliever' || s.permanentGroup === 'Reliever';
    });
    const assignmentsByDay = new Map<string, Map<string, Staff[]>>();

    days.forEach(day => {
      const dayAssignments = new Map<string, Staff[]>();
      const assignedThisDay = new Set<string>();
      
      const unassignedOffStaff = staff.filter(s => {
         const rEntries = roster.filter(r => r.staffId === s.id);
         const shiftChangeEntry = rEntries.find(r => r.isShiftChange);
         const isSReliever = shiftChangeEntry ? shiftChangeEntry.assignedShift === 'Reliever' : s.permanentGroup === 'Reliever';
         if (isSReliever) return false;
         if (String(s.offDay || '').trim().toLowerCase() !== day.dayStr.toLowerCase()) return false;
         return true;
      });

      relievers.forEach(r => {
          if (String(r.offDay || '').trim().toLowerCase() === day.dayStr.toLowerCase()) return;
          
          const covered: Staff[] = [];
          for (let i = unassignedOffStaff.length - 1; i >= 0; i--) {
              const s = unassignedOffStaff[i];
              if (assignedThisDay.has(s.id)) continue;
              
              const supportedPosts = posts.filter(p => {
                const initialPost = initialPosts.find(ip => ip.id === p.id);
                const supports = p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
                return supports.includes(r.id);
              });
              
              const sSub = (s.subSection || '').toLowerCase();
              const rSub = (r.subSection || '').toLowerCase();
              
              let matches = false;
              if (r.role !== s.role) {
                  matches = false;
              } else {
                  const sTags = extractPostNumbers(sSub);
                  const rTags = extractPostNumbers(rSub);
                  
                  if (sTags.length > 0 && rTags.length > 0) {
                      if (sTags.some(tag => rTags.includes(tag))) matches = true;
                  }
                  
                  if (!matches && sTags.length === 0 && rTags.length === 0) {
                      if (rSub && sSub && (rSub.includes(sSub) || sSub.includes(rSub)) && sSub.length > 3) matches = true;
                  }
                  
                  if (!matches) {
                    matches = supportedPosts.some(p => {
                      const pTags = extractPostNumbers(p.name);
                      if (sTags.length > 0 && pTags.length > 0) {
                          if (sTags.some(tag => pTags.includes(tag))) return true;
                      }
                      const pName = p.name.toLowerCase();
                      if (sSub.includes(pName) || pName.includes(sSub)) return true;
                      return false;
                    });
                  }
              }

              if (matches) {
                 covered.push(s);
                 assignedThisDay.add(s.id);
                 unassignedOffStaff.splice(i, 1);
              }
          }
          dayAssignments.set(r.id, covered);
      });
      assignmentsByDay.set(day.iso, dayAssignments);
    });

    staff.forEach(s => {
      const rEntries = roster.filter(r => r.staffId === s.id);
      if (rEntries.length === 0) return;

      days.forEach((day, idx) => {
         const dayTime = day.date.getTime();
         
         let activeEntry = rEntries.find(r => {
             if (r.isShiftChange && r.shiftChangeDates) {
                 const sMatch = r.shiftChangeDates.match(/\d{4}-\d{2}-\d{2}/g);
                 if (sMatch && sMatch.length >= 1) {
                    const sTime = new Date(sMatch[0]).getTime();
                    const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
                    const isActive = (dayTime >= sTime && dayTime <= eTime);
                    if (r.shiftChangeDates.includes('শিফট)')) return !isActive;
                    return isActive;
                 }
             }
             return false;
         });

         if (!activeEntry) activeEntry = rEntries.find(r => r.isReplacement);
         if (!activeEntry) activeEntry = rEntries.find(r => !r.isShiftChange && !r.isReplacement) || rEntries[0];

         let isOff = false;
         if (activeEntry.assignedShift === 'Leave') isOff = true;
         if (activeEntry.offDay && activeEntry.offDay.trim().toLowerCase() === day.dayStr.toLowerCase()) isOff = true;
         if (activeEntry.leaveStartDate) {
            const lStart = new Date(activeEntry.leaveStartDate).getTime();
            const lEnd = activeEntry.leaveEndDate ? new Date(activeEntry.leaveEndDate).getTime() : Infinity;
            if (dayTime >= lStart && dayTime <= lEnd) isOff = true;
         }

         if (!isOff) {
             const isCurrentlyReliever = activeEntry.assignedShift === 'Reliever' || (s.permanentGroup === 'Reliever' && !activeEntry.isShiftChange && !activeEntry.isReplacement);
             if (!isCurrentlyReliever) {
                 if (['A', 'B', 'C'].includes(activeEntry.assignedShift)) {
                     result[idx][activeEntry.assignedShift as 'A' | 'B' | 'C']++;
                 }
             } else {
                 const coveredStaff = assignmentsByDay.get(day.iso)?.get(s.id) || [];
                 
                 let replacedShift: 'A' | 'B' | 'C' | null = null;
                 
                 if (coveredStaff.length > 0) {
                     // Get the shift of the first person we are covering
                     const os = coveredStaff[0];
                     const osEntries = roster.filter(r => r.staffId === os.id);
                     if (osEntries.length > 0) {
                         let osActiveEntry = osEntries.find(r => {
                             if (r.isShiftChange && r.shiftChangeDates) {
                                 const sMatch = r.shiftChangeDates.match(/\d{4}-\d{2}-\d{2}/g);
                                 if (sMatch && sMatch.length >= 1) {
                                    const sTime = new Date(sMatch[0]).getTime();
                                    const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
                                    const isActive = (dayTime >= sTime && dayTime <= eTime);
                                    if (r.shiftChangeDates.includes('শিফট)')) return !isActive;
                                    return isActive;
                                 }
                             }
                             return false;
                         });
                         if (!osActiveEntry) osActiveEntry = osEntries.find(r => !r.isShiftChange && !r.isReplacement) || osEntries[0];
                         
                         if (osActiveEntry && ['A', 'B', 'C'].includes(osActiveEntry.assignedShift)) {
                             replacedShift = osActiveEntry.assignedShift as 'A' | 'B' | 'C';
                         }
                     }
                 }

                 if (!replacedShift) {
                     const shiftMatch = (s.subSection || '').match(/Shift-\s*([ABC])/i);
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
                 }
             }
         }
      });
    });

    return result;
  }, [roster, days, staff, posts]);

  const getStatusBadge = (count: number, target: number) => {
    const diff = count - target;
    if (diff === 0) return <span className="text-emerald-600 font-medium">✓ সঠিক ({count})</span>;
    if (diff > 0) return <span className="text-indigo-600 font-medium">+{diff} বেশি ({count})</span>;
    return <span className="text-rose-600 font-medium">{diff} শর্ট ({count})</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">প্রতিদিনের ম্যানপাওয়ার স্ট্যাটাস</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">তারিখ</th>
              <th className="px-6 py-3">A Shift (Target: {targets.A})</th>
              <th className="px-6 py-3">B Shift (Target: {targets.B})</th>
              <th className="px-6 py-3">C Shift (Target: {targets.C})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dailyManpower.map(day => (
              <tr key={day.iso} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-left font-medium text-slate-800">
                  {day.iso} ({day.nameBn})
                </td>
                <td className="px-6 py-3">{getStatusBadge(day.A, targets.A)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.B, targets.B)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.C, targets.C)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
