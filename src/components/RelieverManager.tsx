import React from 'react';
import { Staff, PostRequirement } from '../types';

interface Props {
  staff: Staff[];
  posts: PostRequirement[];
}

export const RelieverManager: React.FC<Props> = ({ staff, posts }) => {
  const relievers = staff.filter(s => s.permanentGroup === 'Reliever');
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Identify all support persons and their status
  const supportPersonsList = posts.flatMap(p => p.supportPersons || []);
  const uniqueSupportPersonIds = Array.from(new Set(supportPersonsList)).filter(id => id);
  const supportPersons = uniqueSupportPersonIds.map(id => staff.find(s => s.id === id)).filter(Boolean) as Staff[];

  return (
    <div className="space-y-8">
      {/* Reliever Routine Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">রিলিভার (Reliever) রুটিন</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 min-w-[200px]">রিলিভারের নাম ও আইডি</th>
                  <th className="px-4 py-3">নির্ধারিত পোস্ট (SubSection)</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relievers.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{r.name} ({r.id})</td>
                    <td className="px-4 py-3 text-slate-600">{r.subSection}</td>
                    {days.map(day => {
                      // Find staff who are off on this day and whose subSection matches what this reliever covers
                      const offStaff = staff.filter(s => {
                        if (s.permanentGroup === 'Reliever') return false;
                        if (s.offDay !== day) return false;
                        
                        const rSub = (r.subSection || '').toLowerCase();
                        const sSub = (s.subSection || '').toLowerCase();
                        
                        if (rSub === sSub) return true;
                        if (rSub.includes(sSub) || sSub.includes(rSub)) return true;
                        
                        const rPostMatches = rSub.match(/post-?\s*\d+/g) || [];
                        const sPostMatches = sSub.match(/post-?\s*\d+/g) || [];
                        
                        for (const rpm of rPostMatches) {
                           if (sSub.includes(rpm)) return true;
                        }
                        for (const spm of sPostMatches) {
                           if (rSub.includes(spm)) return true;
                        }
                        return false;
                      });

                      let text = '-';
                      if (r.offDay === day) {
                        text = 'Weekly Off';
                      } else if (offStaff.length > 0) {
                        text = offStaff.map(s => `${s.name} (${s.id})`).join(', ');
                      }
                      
                      return (
                        <td key={day} className="px-4 py-3 text-center">
                          {text === 'Weekly Off' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">অফ ডে</span>
                          ) : text !== '-' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap">
                              {text}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Support Persons Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Leave / Absent Support (Available Backup)</h2>
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
          <p className="text-sm text-amber-800">
            <strong>সতর্কতা (Reminder):</strong> Support Person-দের যদি Night (C Shift) এর পরদিন Morning (A) বা General (G) শিফটে ডিউটি পড়ে, তবে তা ম্যানুয়ালি চেক করে পরিবর্তন করুন।
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">সাপোর্ট ব্যক্তির নাম ও আইডি</th>
                  <th className="px-4 py-3">যেসব পোস্টের সাপোর্ট হিসেবে নির্ধারিত</th>
                  <th className="px-4 py-3">বর্তমান স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supportPersons.map(sp => {
                  const assignedPostsForSupport = posts.filter(p => (p.supportPersons || []).includes(sp.id));
                  return (
                    <tr key={sp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{sp.name} ({sp.id})</td>
                      <td className="px-4 py-3 text-slate-600">
                        {assignedPostsForSupport.map(p => p.name).join(', ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          Available Backup
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
