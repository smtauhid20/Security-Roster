const fs = require('fs');
const dataStr = fs.readFileSync('src/data.ts', 'utf8');

// Poor man's parse
const staffMatch = dataStr.match(/export const allStaff: Staff\[\] = \[([\s\S]*?)\];/);
const postsMatch = dataStr.match(/export const postRequirements: PostRequirement\[\] = \[([\s\S]*?)\];/);

const staff = eval('[' + staffMatch[1] + ']');
const posts = eval('[' + postsMatch[1] + ']');

const r = staff.find(s => s.id === '313107'); // Amrite Paul
const day = 'Saturday';

const offStaff = staff.filter(s => {
  if (s.offDay !== day) return false;
  const isSReliever = s.permanentGroup === 'Reliever';
  if (isSReliever) return false;
  
  const supportedPosts = posts.filter(p => (p.supportPersons || []).includes(r.id));
  const sSub = (s.subSection || '').toLowerCase();
  
  if (r.id === '314842' && s.role === 'LadyGuard') return true;
  
  return supportedPosts.some(p => {
    const pName = p.name.toLowerCase();
    return sSub.includes(pName) || pName.includes(sSub) || 
           (sSub.includes('post-') && pName.includes('post-') && sSub.match(/\d+/) && pName.match(/\d+/) && sSub.match(/\d+/)?.[0] === pName.match(/\d+/)?.[0]);
  });
});

console.log("Off staff for Amrite Paul on Saturday:", offStaff.map(s => s.name));
