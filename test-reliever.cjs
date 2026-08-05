const staff = [
  { id: '301098', name: 'Abdul Ahad', role: 'Guard', permanentGroup: 'C', subSection: 'Post-10 (Bangadoba Main Gate)', offDay: 'Saturday' },
  { id: '304151', name: 'Md. Suhel Ahmod Sumon', role: 'Guard', permanentGroup: 'Reliever', subSection: 'Reliever + Post-10', offDay: 'Wednesday' }
];

const r = staff[1];
const s = staff[0];

const sSub = (s.subSection || '').toLowerCase();
const rSub = (r.subSection || '').toLowerCase();

console.log("sSub:", sSub);
console.log("rSub:", rSub);

const sSubIsPost = sSub.includes('post') || sSub.includes('p-');
const rSubIsPost = rSub.includes('post') || rSub.includes('p-');

console.log("sSubIsPost:", sSubIsPost);
console.log("rSubIsPost:", rSubIsPost);

if (sSubIsPost && rSubIsPost) {
   const sNums = sSub.match(/\d+/g) || [];
   const rNums = rSub.match(/\d+/g) || [];
   console.log("sNums:", sNums, "rNums:", rNums);
   if (sNums.some(num => rNums.includes(num))) {
       console.log("MATCHES BY NUMBERS");
   }
}
