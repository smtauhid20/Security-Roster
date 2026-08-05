const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppState.ts', 'utf8');

const searchData = `if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.staff) setStaff(data.staff);`;
          
const replaceData = `if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.staff) {
             const fixedStaff = data.staff.map((s: any) => {
                 // Auto-fix Abdul Ahad's off day to Saturday if it is currently stuck on Tuesday
                 if (s.id === '301098' && s.offDay === 'Tuesday') {
                     return { ...s, offDay: 'Saturday' };
                 }
                 return s;
             });
             setStaff(fixedStaff);
          }`;

code = code.replace(searchData, replaceData);

// also for localStorage
const searchLocal = `if (savedStaff) setStaff(JSON.parse(savedStaff));`;
const replaceLocal = `if (savedStaff) {
       const parsed = JSON.parse(savedStaff);
       const fixed = parsed.map((s: any) => {
           if (s.id === '301098' && s.offDay === 'Tuesday') {
               return { ...s, offDay: 'Saturday' };
           }
           return s;
       });
       setStaff(fixed);
    }`;

code = code.replace(searchLocal, replaceLocal);

fs.writeFileSync('src/hooks/useAppState.ts', code);
