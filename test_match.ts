import { allStaff, postRequirements } from './src/data';
import { DailyManpowerStatus } from './src/components/DailyManpowerStatus';
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
const kalam = allStaff.find(s => s.id === '300915');
const r1 = allStaff.find(s => s.id === '312292');
console.log("Kalam tags:", extractPostNumbers(kalam.subSection));
console.log("R1 tags:", extractPostNumbers(r1.subSection));
const posts = postRequirements.filter(p => p.supportPersons.includes(r1.id));
console.log("R1 supported posts:", posts.map(p => p.name));
