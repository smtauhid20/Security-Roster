const staff = [
  { id: '301098', name: 'Abdul Ahad', role: 'Guard', permanentGroup: 'C', subSection: 'Post-10 (Bangadoba Main Gate)', offDay: 'Saturday' },
  { id: '304151', name: 'Md. Suhel Ahmod Sumon', role: 'Guard', permanentGroup: 'Reliever', subSection: 'Reliever + Post-10', offDay: 'Wednesday' }
];
const initialPosts = [
  { id: 'p10', name: 'Post-10 (Bangadoba Main Gate)', supportPersons: ['304151'] }
];
const posts = initialPosts;
const changedShiftMap = new Map();

const r = staff[1];
const day = 'Saturday';

const offStaff = staff.filter(s => {
    const isSReliever = changedShiftMap.has(s.id) ? changedShiftMap.get(s.id) === 'Reliever' : s.permanentGroup === 'Reliever';
    if (isSReliever) return false;
    if (s.offDay !== day) return false;
    
    const supportedPosts = posts.filter(p => {
      const initialPost = initialPosts.find(ip => ip.id === p.id);
      const supports = p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
      return supports.includes(r.id);
    });
    const sSub = (s.subSection || '').toLowerCase();
    const rSub = (r.subSection || '').toLowerCase();
    
    if (r.role === 'LadyGuard' && s.role === 'LadyGuard') return true;
    if (r.role === 'Supervisor' && s.role === 'Supervisor') return true;
    
    // Check if reliever's subsection explicitly lists the off-staff's post
    const sSubIsPost = sSub.includes('post') || sSub.includes('p-');
    const rSubIsPost = rSub.includes('post') || rSub.includes('p-');
    
    if (sSubIsPost && rSubIsPost) {
       const sNums = sSub.match(/\d+/g) || [];
       const rNums = rSub.match(/\d+/g) || [];
       if (sNums.some(num => rNums.includes(num))) return true;
    }
    
    // Check string inclusion
    if (rSub.includes(sSub) && sSub.length > 3) return true;
    
    return supportedPosts.some(p => {
      const pName = p.name.toLowerCase();
      return sSub.includes(pName) || pName.includes(sSub) || 
              (sSubIsPost && pName.includes('post') && sSub.match(/\d+/) && pName.match(/\d+/) && sSub.match(/\d+/)?.[0] === pName.match(/\d+/)?.[0]);
    });
});

console.log(offStaff);
