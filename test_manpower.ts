import { allStaff, postRequirements } from './src/data';
import { format, addDays } from 'date-fns';

const days = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(new Date('2026-08-01'), i);
    return {
        iso: format(d, 'yyyy-MM-dd'),
        dayStr: format(d, 'EEEE')
    };
});

const assignmentsByDay = new Map<string, Map<string, any[]>>();

const staff = allStaff;
const relievers = staff.filter(s => s.permanentGroup === 'Reliever');

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

days.forEach(day => {
    const dayAssignments = new Map<string, any[]>();
    const assignedThisDay = new Set<string>();
    
    const unassignedOffStaff = staff.filter(s => {
        if (s.permanentGroup === 'Reliever') return false;
        if (String(s.offDay || '').trim().toLowerCase() !== day.dayStr.toLowerCase()) return false;
        return true;
    });

    relievers.forEach(r => {
        if (String(r.offDay || '').trim().toLowerCase() === day.dayStr.toLowerCase()) return;
        
        const covered: any[] = [];
        for (let i = unassignedOffStaff.length - 1; i >= 0; i--) {
            const s = unassignedOffStaff[i];
            if (assignedThisDay.has(s.id)) continue;
            
            const supportedPosts = postRequirements.filter(p => (p.supportPersons || []).includes(r.id));
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
    console.log(`--- ${day.dayStr} ---`);
    console.log(`Total Unassigned (NOT COVERED) staff: ${unassignedOffStaff.length}`);
    unassignedOffStaff.forEach(u => console.log(`  Uncovered: ${u.name} (${u.permanentGroup}) [${u.role}] - ${u.subSection}`));
});
