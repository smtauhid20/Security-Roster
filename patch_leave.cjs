const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveOTManager.tsx', 'utf8');

// Auto-fill leave shift and post
const searchLeaveId = `<select className="w-full p-2 border rounded-md text-sm bg-white" value={leaveStaffId} onChange={e => setLeaveStaffId(e.target.value)}>`;
const replaceLeaveId = `<select className="w-full p-2 border rounded-md text-sm bg-white" value={leaveStaffId} onChange={e => {
                const id = e.target.value;
                setLeaveStaffId(id);
                const s = staff.find(x => x.id === id);
                if (s) {
                  setLeaveShift(s.permanentGroup === 'Reliever' ? 'General' : s.permanentGroup as ShiftType);
                  setLeavePost(s.subSection || '');
                }
              }}>`;
code = code.replace(searchLeaveId, replaceLeaveId);

// Update label for Leave shift
const searchShiftLabel = `<label className="block text-sm font-medium text-slate-700 mb-1">শিফট</label>`;
const replaceShiftLabel = `<label className="block text-sm font-medium text-slate-700 mb-1">পার্মানেন্ট শিফট/গ্রুপ</label>`;
code = code.replace(searchShiftLabel, replaceShiftLabel);

fs.writeFileSync('src/components/LeaveOTManager.tsx', code);
