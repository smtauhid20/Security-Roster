const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

const search = `                            {offStaff.map(s => (
                              <span key={s.id} className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-100">
                                {s.name} ({s.id}) - {s.subSection || 'Unknown'}
                              </span>
                            ))}`;

const replace = `                            {offStaff.map(s => {
                                const targetShift = changedShiftMap.get(s.id) || s.permanentGroup;
                                return (
                                  <span key={s.id} className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-100">
                                    {s.name} ({s.id}) - {s.subSection || 'Unknown'} (Shift: {targetShift})
                                  </span>
                                );
                            })}`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/RelieverManager.tsx', code);
