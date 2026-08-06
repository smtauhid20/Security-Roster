const extractPostNumbers = (str, type) => {
   const nums = [];
   // look for 'post' and following numbers
   const regex = /(?:post|rg)[-\s]*([\d\s,&and]+)/gi;
   let match;
   while ((match = regex.exec(str)) !== null) {
       const extracted = match[1].match(/\d+/g);
       if (extracted) {
           const prefix = match[0].toLowerCase().includes('rg') ? 'rg' : 'post';
           nums.push(...extracted.map(n => prefix + '-' + parseInt(n).toString()));
       }
   }
   // If no 'post-' keyword but it's a short string or we just want numbers
   if (nums.length === 0) {
       const allNums = str.match(/\d+/g);
       if (allNums && type === 'post') {
           nums.push(...allNums.map(n => 'post-' + parseInt(n).toString()));
       }
   }
   return nums;
};

const examples = [
    'Reliever + Post-2,4,6,RG-1&2',
    'Reliever + Post-07 & 08',
    'Reliever + Post-10',
    'Post-1(Main Gate)',
    'Post-10 (Bangadoba Main Gate)',
    'RG-1',
    'Reliever + Post-5 + Shift- B'
];

examples.forEach(e => {
    console.log(e, "->", extractPostNumbers(e, 'staff'));
});

