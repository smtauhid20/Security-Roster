import React, { useMemo } from 'react';
import { RosterAssignment, PostRequirement, Staff } from '../types';
import { postRequirements as initialPosts } from '../data';

interface Props {
  roster: RosterAssignment[];
  startDate: string;
  posts: PostRequirement[];
  staff: Staff[];
}

export const DailyManpowerStatus: React.FC<Props> = ({ roster, startDate, posts, staff }) => {
  const days = useMemo(() => {
    const start = new Date(startDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        iso: d.toISOString().split('T')[0],
        date: d,
        nameBn: d.toLocaleDateString('bn-BD', { weekday: 'short' }),
        dayStr: d.toLocaleDateString('en-US', { weekday: 'long' })
      };
    });
  }, [startDate]);

  const targets = useMemo(() => {
    let A = 0, B = 0, C = 0;
    posts.forEach(p => {
      A += p.shiftCounts.A || 0;
      B += p.shiftCounts.B || 0;
      C += p.shiftCounts.C || 0;
    });
    return { A, B, C };
  }, [posts]);

  const dailyManpower = useMemo(() => {
    const result = days.map(day => ({ 
      iso: day.iso, 
      nameBn: day.nameBn, 
      A: 0, B: 0, C: 0 
    }));
    
    roster.forEach(r => {
      days.forEach((day, idx) => {
        const dayTime = day.date.getTime();
        let isValidToday = true;

        if (r.assignedShift === 'Leave') {
          isValidToday = false;
        }

        if (isValidToday && r.offDay && r.offDay.trim().toLowerCase() === day.dayStr.toLowerCase()) {
          isValidToday = false;
        }

        if (isValidToday && r.leaveStartDate) {
          const lStart = new Date(r.leaveStartDate).getTime();
          const lEnd = r.leaveEndDate ? new Date(r.leaveEndDate).getTime() : Infinity;
          if (dayTime >= lStart && dayTime <= lEnd) {
            isValidToday = false;
          }
        }

        if (isValidToday && r.isShiftChange && r.shiftChangeDates) {
          const sMatch = r.shiftChangeDates.match(/\d{4}-\d{2}-\d{2}/g);
          if (sMatch && sMatch.length >= 1) {
            const sTime = new Date(sMatch[0]).getTime();
            const eTime = sMatch.length > 1 ? new Date(sMatch[1]).getTime() : sTime;
            // Add a 12-hour buffer to handle time zone issues
            // Just comparing timestamps of start of day is fine since we parsed YYYY-MM-DD
            const isShiftChangeActiveToday = (dayTime >= sTime && dayTime <= eTime);
            
            if (r.shiftChangeDates.includes('শিফট)')) {
              if (isShiftChangeActiveToday) isValidToday = false;
            } else {
              if (!isShiftChangeActiveToday) isValidToday = false;
            }
          }
        }

        if (isValidToday) {
          if (r.assignedShift === 'A' || r.assignedShift === 'B' || r.assignedShift === 'C') {
            result[idx][r.assignedShift]++;
          }
        }
      });
    });
    
    return result;
  }, [roster, days]);

  const getStatusBadge = (count: number, target: number) => {
    const diff = count - target;
    if (diff === 0) return <span className="text-emerald-600 font-medium">✓ সঠিক ({count})</span>;
    if (diff > 0) return <span className="text-indigo-600 font-medium">+{diff} বেশি ({count})</span>;
    return <span className="text-rose-600 font-medium">{diff} শর্ট ({count})</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">প্রতিদিনের ম্যানপাওয়ার স্ট্যাটাস</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">তারিখ</th>
              <th className="px-6 py-3">A Shift (Target: {targets.A})</th>
              <th className="px-6 py-3">B Shift (Target: {targets.B})</th>
              <th className="px-6 py-3">C Shift (Target: {targets.C})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dailyManpower.map(day => (
              <tr key={day.iso} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-left font-medium text-slate-800">
                  {day.iso} ({day.nameBn})
                </td>
                <td className="px-6 py-3">{getStatusBadge(day.A, targets.A)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.B, targets.B)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.C, targets.C)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
