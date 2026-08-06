import { allStaff, postRequirements as posts } from './src/data';
const staff = allStaff;

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

const amrite = staff.find(s => s.id === '313107')!;
const mafiga = staff.find(s => s.id === '314842')!;
const amena = staff.find(s => s.id === '300914')!;
const anamul = staff.find(s => s.id === '315049')!;

const relievers = [amrite, mafiga];
const unassigned = [amena, anamul];
const assigned = new Set();

relievers.forEach(r => {
    const covered: any[] = [];
    for(let i = unassigned.length-1; i>=0; i--) {
        const s = unassigned[i];
        if (assigned.has(s.id)) continue;
        
        let matches = false;
        if (r.role !== s.role) {
            matches = false;
        } else {
            const sSub = (s.subSection || '').toLowerCase();
            const rSub = (r.subSection || '').toLowerCase();
            const sTags = extractPostNumbers(sSub);
            const rTags = extractPostNumbers(rSub);
            
            if (sTags.length > 0 && rTags.length > 0) {
                if (sTags.some(tag => rTags.includes(tag))) matches = true;
            }
            if (!matches) {
                // fallback to support persons... (omitted for brevity, assume true if matches)
                const supportedPosts = posts.filter(p => (p.supportPersons || []).includes(r.id));
                matches = supportedPosts.some(p => {
                    const pTags = extractPostNumbers(p.name);
                    if (sTags.some(tag => pTags.includes(tag))) return true;
                    return false;
                });
            }
        }
        if (matches) {
            covered.push(s);
            assigned.add(s.id);
        }
    }
    console.log(r.name, "covers:", covered.map(s => s.name));
});
