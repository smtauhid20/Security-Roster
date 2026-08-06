const { allStaff, postRequirements } = require('./dist_test/data');
const { generateWeeklyRoster } = require('./dist_test/utils/rosterAlgorithm');

const roster = generateWeeklyRoster(1, '2026-08-01', allStaff, postRequirements, [], [], []);

const thurRoster = roster.filter(r => r.assignedShift === 'A');
console.log('Roster Table A Shift Count:', thurRoster.length);

const extractPostNumbers = (str) => {
   const nums = [];
   const regex = /(?:post|rg)[-\s]*([\d\s,&and]+)/gi;
   let match;
   while ((match = regex.exec(str)) !== null) {
       const extracted = match[1].match(/\d+/g);
       if (extracted) {
           const prefix = match[0].toLowerCase().includes('rg') ? 'rg' : 'post';
           nums.push(...extracted.map(n => prefix + '-' + parseInt(n).toString()));
       }
   }
   if (nums.length === 0) {
       const allNums = str.match(/\d+/g);
       if (allNums && str.toLowerCase().includes('post')) {
           nums.push(...allNums.map(n => 'post-' + parseInt(n).toString()));
       }
   }
   return nums;
};

const dayStr = 'Thursday';
let countA = 0;
let peopleA = [];

allStaff.forEach(s => {
  const rEntries = roster.filter(r => r.staffId === s.id);
  const activeEntry = rEntries[0];
  if (!activeEntry) return;
  
  let isOff = false;
  if (activeEntry.assignedShift === 'Leave') isOff = true;
  if (activeEntry.offDay && activeEntry.offDay.trim().toLowerCase() === dayStr.toLowerCase()) isOff = true;
  
  if (!isOff) {
    if (s.permanentGroup !== 'Reliever') {
       if (activeEntry.assignedShift === 'A') {
           countA++;
           peopleA.push(s.name + ' (Perm)');
       }
    } else {
       const offStaff = allStaff.filter(os => {
           if (os.id === s.id) return false;
           if (os.permanentGroup === 'Reliever') return false;
           if (String(os.offDay || '').trim().toLowerCase() !== dayStr.toLowerCase()) return false;
           return true;
       });
       
       let replacedShift = null;
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
               const supportedPosts = postRequirements.filter(p => {
                  return (p.supportPersons || []).includes(s.id);
               });
               matches = supportedPosts.some(p => {
                  const pTags = extractPostNumbers(p.name);
                  if (sTags.length > 0 && pTags.length > 0 && sTags.some(tag => pTags.includes(tag))) return true;
                  const pName = p.name.toLowerCase();
                  return sSub.includes(pName) || pName.includes(sSub);
               });
           }
           
           if (matches) {
               const osEntries = roster.filter(r => r.staffId === os.id);
               if (osEntries[0] && ['A', 'B', 'C'].includes(osEntries[0].assignedShift)) {
                   replacedShift = osEntries[0].assignedShift;
                   break;
               }
           }
       }
       
       if (replacedShift === 'A') {
           countA++;
           peopleA.push(s.name + ' (Relieving A)');
       } else if (!replacedShift && activeEntry.assignedShift === 'A') {
           countA++;
           peopleA.push(s.name + ' (Fallback Reliever A)');
       }
    }
  }
});
console.log('DailyManpowerStatus A count for Thursday:', countA);
console.log('People in A:', peopleA.join(', '));
