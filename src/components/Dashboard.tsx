import React from 'react';
import { Staff, PostRequirement, LeaveRecord, OTRecord, RosterAssignment } from '../types';
import { Users, Clock, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  staff: Staff[];
  posts: PostRequirement[];
  leaves: LeaveRecord[];
  ots: OTRecord[];
  roster: RosterAssignment[];
}

export const Dashboard: React.FC<Props> = ({ staff, posts, leaves, ots, roster }) => {
  const totalStaff = staff.length;
  const activeLeaves = leaves.length;
  const activeOTs = ots.length;
  
  const guards = staff.filter(s => s.role === 'Guard').length;
  const ladyGuards = staff.filter(s => s.role === 'LadyGuard').length;
  const supervisors = staff.filter(s => s.role === 'Supervisor').length;
  const officers = staff.filter(s => s.role === 'Officer').length;
  
  // Calculate requirements per shift based on posts
  const reqA = posts.reduce((sum, p) => sum + (p.shiftCounts.A || 0), 0);
  const reqB = posts.reduce((sum, p) => sum + (p.shiftCounts.B || 0), 0);
  const reqC = posts.reduce((sum, p) => sum + (p.shiftCounts.C || 0), 0);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">ড্যাশবোর্ড ওভারভিউ</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">মোট লোকবল</p>
            <p className="text-2xl font-bold text-slate-800">{totalStaff} জন</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">ছুটিতে আছে</p>
            <p className="text-2xl font-bold text-slate-800">{activeLeaves} জন</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">ওভারটাইম ডিমান্ড</p>
            <p className="text-2xl font-bold text-slate-800">{activeOTs} টি</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 w-full">
            <p className="text-sm font-medium text-slate-500 mb-2">পদবী ভিত্তিক লোকবল</p>
            <div className="text-sm font-bold text-slate-800 space-y-1">
              <div className="flex justify-between"><span>অফিসার</span><span>- {officers}</span></div>
              <div className="flex justify-between"><span>সুপারভাইজর</span><span>- {supervisors}</span></div>
              <div className="flex justify-between"><span>গার্ড</span><span>- {guards}</span></div>
              <div className="flex justify-between"><span>লেডি গার্ড</span><span>- {ladyGuards}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">শিফট অনুযায়ী প্রয়োজন (পোস্ট ভিত্তিক)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-700">A Shift (সকাল ৭টা - বিকাল ৩টা)</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{reqA} জন</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-700">B Shift (বিকাল ৩টা - রাত ১১টা)</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{reqB} জন</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-700">C Shift (রাত ১১টা - সকাল ৬টা)</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{reqC} জন</span>
            </div>
          </div>
        </div>

        
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${aCount < reqA ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {aCount} জন {aCount < reqA ? `(-${reqA - aCount})` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${bCount < reqB ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {bCount} জন {bCount < reqB ? `(-${reqB - bCount})` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cCount < reqC ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {cCount} জন {cCount < reqC ? `(-${reqC - cCount})` : ''}
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
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            সাম্প্রতিক আপডেট
          </h3>
          <div className="text-sm text-slate-600 space-y-3">
            <p>• নতুন স্টাফ অ্যাড বা ডিলিট করতে "স্টাফ ম্যানেজমেন্ট" ব্যবহার করুন।</p>
            <p>• কোন পোস্টের লোকবল পরিবর্তন করতে "পোস্ট ম্যানেজমেন্ট" ব্যবহার করুন।</p>
            <p>• ওভারটাইম এবং ছুটির হিসাব "ছুটি ও ওভারটাইম" ট্যাবে ইনপুট দিন।</p>
            <p>• রোস্টার ট্যাবে ডাইনামিক রোটেশন সহ আপডেট দেখা যাবে।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
