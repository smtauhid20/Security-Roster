const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const search = `<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">`;
          
const replace = `
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2 mt-2">
        <h3 className="text-lg font-bold text-slate-800 mb-4">প্রতিদিনের ম্যানপাওয়ার স্ট্যাটাস (Daily Manpower Status)</h3>
        <p className="text-sm text-slate-500 mb-4">
          লিভ, সাপ্তাহিক অফ ডে, এবং অন্যান্য রদবদলের পর কোন শিফটে প্রতিদিন কতজন উপস্থিত থাকবেন তার হিসাব। 
          (লাল রঙের মানে হলো ম্যানপাওয়ার শর্টেজ আছে)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">দিন</th>
                <th className="px-4 py-3 text-center">A Shift (Target: {reqA})</th>
                <th className="px-4 py-3 text-center">B Shift (Target: {reqB})</th>
                <th className="px-4 py-3 text-center">C Shift (Target: {reqC})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const dayNames: Record<string, string> = {
                  Saturday: 'শনিবার', Sunday: 'রবিবার', Monday: 'সোমবার', Tuesday: 'মঙ্গলবার',
                  Wednesday: 'বুধবার', Thursday: 'বৃহস্পতিবার', Friday: 'শুক্রবার'
                };
                
                const aCount = roster.filter(r => r.assignedShift === 'A' && r.offDay !== day).length;
                const bCount = roster.filter(r => r.assignedShift === 'B' && r.offDay !== day).length;
                const cCount = roster.filter(r => r.assignedShift === 'C' && r.offDay !== day).length;

                return (
                  <tr key={day} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{dayNames[day]}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold \${aCount < reqA ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}\`}>
                        {aCount} জন {aCount < reqA ? \`(-\${reqA - aCount})\` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold \${bCount < reqB ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}\`}>
                        {bCount} জন {bCount < reqB ? \`(-\${reqB - bCount})\` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold \${cCount < reqC ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}\`}>
                        {cCount} জন {cCount < reqC ? \`(-\${reqC - cCount})\` : ''}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/Dashboard.tsx', code);
