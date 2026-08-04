const fs = require('fs');

let typesCode = fs.readFileSync('src/types.ts', 'utf8');
typesCode = typesCode.replace(
  "leaveEndDate?: string;",
  "leaveEndDate?: string;\n  originalPost?: string;"
);
fs.writeFileSync('src/types.ts', typesCode);

let algoCode = fs.readFileSync('src/utils/rosterAlgorithm.ts', 'utf8');
algoCode = algoCode.replace(
  "leaveEndDate: weekLeaves.find(l => l.staffId === staff.id)?.endDate",
  "leaveEndDate: weekLeaves.find(l => l.staffId === staff.id)?.endDate,\n        originalPost: staff.subSection"
);
fs.writeFileSync('src/utils/rosterAlgorithm.ts', algoCode);

let rosterCode = fs.readFileSync('src/components/RosterTable.tsx', 'utf8');
const search = `<td className="px-6 py-3 font-semibold text-slate-700">{row.assignedPost}</td>`;
const replace = `<td className="px-6 py-3 font-semibold text-slate-700">
                        {shift === 'Leave' ? (
                          <div className="flex flex-col">
                            <span className="text-rose-600">{row.assignedPost}</span>
                            {row.originalPost && <span className="text-xs text-slate-500 font-normal mt-0.5">মূল পোস্ট: {row.originalPost}</span>}
                            {(row.leaveStartDate || row.leaveEndDate) && (
                              <span className="text-xs text-slate-500 font-normal mt-0.5">
                                তারিখ: {row.leaveStartDate ? formatDisplayDate(row.leaveStartDate) : '?'} হতে {row.leaveEndDate ? formatDisplayDate(row.leaveEndDate) : '?'} 
                                {row.leaveStartDate && row.leaveEndDate && (
                                  <span className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">
                                    ({Math.ceil((new Date(row.leaveEndDate).getTime() - new Date(row.leaveStartDate).getTime()) / (1000 * 3600 * 24)) + 1} দিন)
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        ) : (
                          row.assignedPost
                        )}
                      </td>`;
rosterCode = rosterCode.replace(search, replace);
fs.writeFileSync('src/components/RosterTable.tsx', rosterCode);

