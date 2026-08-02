import React, { useState } from 'react';
import { Staff, LeaveRecord, OTRecord, PostRequirement, ShiftType } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  staff: Staff[];
  posts: PostRequirement[];
  leaves: LeaveRecord[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRecord[]>>;
  ots: OTRecord[];
  setOts: React.Dispatch<React.SetStateAction<OTRecord[]>>;
}

export const LeaveOTManager: React.FC<Props> = ({ staff, posts, leaves, setLeaves, ots, setOts }) => {
  const [week, setWeek] = useState(1);

  // Leave Form
  const [leaveStaffId, setLeaveStaffId] = useState('');
  const [replacementStaffId, setReplacementStaffId] = useState('');
  const [leavePost, setLeavePost] = useState('');
  const [leaveShift, setLeaveShift] = useState<ShiftType>('A');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');

  // OT Form
  const [otShift, setOtShift] = useState<ShiftType>('A');
  const [otPost, setOtPost] = useState('');
  const [otStaffId, setOtStaffId] = useState('');

  const addLeave = () => {
    if (!leaveStaffId) return;
    const newLeave: LeaveRecord = {
      id: Date.now().toString(),
      weekNumber: week,
      staffId: leaveStaffId,
      replacementStaffId: replacementStaffId || undefined,
      postName: leavePost || undefined,
      shiftType: leaveShift,
      startDate: leaveStartDate || undefined,
      endDate: leaveEndDate || undefined,
    };
    setLeaves([...leaves, newLeave]);
    setLeaveStaffId('');
    setReplacementStaffId('');
    setLeaveStartDate('');
    setLeaveEndDate('');
  };

  const addOT = () => {
    if (!otPost) return;
    const newOT: OTRecord = {
      id: Date.now().toString(),
      weekNumber: week,
      shift: otShift,
      postName: otPost,
      staffId: otStaffId || undefined
    };
    setOts([...ots, newOT]);
    setOtPost('');
    setOtStaffId('');
  };

  const weekLeaves = leaves.filter(l => l.weekNumber === week);
  const weekOts = ots.filter(o => o.weekNumber === week);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">ছুটি এবং ওভারটাইম ম্যানেজমেন্ট</h2>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
          <label className="text-sm font-medium text-slate-700">সপ্তাহ নির্বাচন:</label>
          <select 
            className="bg-transparent border-none text-sm font-bold text-indigo-700 focus:ring-0 cursor-pointer"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map(w => (
              <option key={w} value={w}>সপ্তাহ {w}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEAVE SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">সাপ্তাহিক ছুটি ইনপুট</h3>
          
          <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">যিনি ছুটিতে থাকবেন</label>
              <select className="w-full p-2 border rounded-md text-sm bg-white" value={leaveStaffId} onChange={e => setLeaveStaffId(e.target.value)}>
                <option value="">নির্বাচন করুন...</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">শিফট</label>
                <select className="w-full p-2 border rounded-md text-sm bg-white" value={leaveShift} onChange={e => setLeaveShift(e.target.value as ShiftType)}>
                  <option value="A">A Shift</option>
                  <option value="B">B Shift</option>
                  <option value="C">C Shift</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">পোস্ট (ঐচ্ছিক)</label>
                <select className="w-full p-2 border rounded-md text-sm bg-white" value={leavePost} onChange={e => setLeavePost(e.target.value)}>
                  <option value="">যেকোন পোস্ট</option>
                  {posts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">বদলি ডিউটি করবেন (ঐচ্ছিক)</label>
              <select className="w-full p-2 border rounded-md text-sm bg-white" value={replacementStaffId} onChange={e => setReplacementStaffId(e.target.value)}>
                <option value="">অটোমেটিক অ্যাসাইন হবে</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">বদলি শুরু তারিখ (ঐচ্ছিক)</label>
                <input type="date" className="w-full p-2 border rounded-md text-sm bg-white" value={leaveStartDate} onChange={e => setLeaveStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">বদলি শেষ তারিখ (ঐচ্ছিক)</label>
                <input type="date" className="w-full p-2 border rounded-md text-sm bg-white" value={leaveEndDate} onChange={e => setLeaveEndDate(e.target.value)} />
              </div>
            </div>

            <button onClick={addLeave} className="w-full bg-indigo-600 text-white p-2 rounded-md font-medium text-sm hover:bg-indigo-700">
              ছুটি অ্যাড করুন
            </button>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">এই সপ্তাহের ছুটিসমূহ ({weekLeaves.length})</h4>
            <ul className="space-y-2">
              {weekLeaves.map(l => {
                const s = staff.find(x => x.id === l.staffId);
                const r = staff.find(x => x.id === l.replacementStaffId);
                return (
                  <li key={l.id} className="p-3 border rounded-lg flex justify-between items-center text-sm bg-slate-50">
                    <div>
                      <p className="font-bold text-rose-600">{s?.name || l.staffId} (ছুটি)</p>
                      <p className="text-slate-500 text-xs">শিফট: {l.shiftType} {l.postName ? `| পোস্ট: ${l.postName}` : ''}</p>
                      {r && <p className="text-emerald-600 font-medium text-xs mt-1">বদলি: {r.name} {l.startDate && l.endDate ? `(${l.startDate} থেকে ${l.endDate})` : l.startDate ? `(শুরু: ${l.startDate})` : l.endDate ? `(শেষ: ${l.endDate})` : ''}</p>}
                    </div>
                    <button onClick={() => setLeaves(leaves.filter(x => x.id !== l.id))} className="text-rose-500 p-1 hover:bg-rose-100 rounded">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </li>
                );
              })}
              {weekLeaves.length === 0 && <p className="text-sm text-slate-500">কোন ছুটি নেই</p>}
            </ul>
          </div>
        </div>

        {/* OT SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">ওভারটাইম (OT) ইনপুট</h3>
          
          <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">শিফট</label>
                <select className="w-full p-2 border rounded-md text-sm bg-white" value={otShift} onChange={e => setOtShift(e.target.value as ShiftType)}>
                  <option value="A">A Shift</option>
                  <option value="B">B Shift</option>
                  <option value="C">C Shift</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">পোস্ট</label>
                <select className="w-full p-2 border rounded-md text-sm bg-white" value={otPost} onChange={e => setOtPost(e.target.value)}>
                  <option value="">নির্বাচন করুন...</option>
                  {posts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">যিনি ডিউটি করবেন (ঐচ্ছিক)</label>
              <select className="w-full p-2 border rounded-md text-sm bg-white" value={otStaffId} onChange={e => setOtStaffId(e.target.value)}>
                <option value="">যেকোন স্টাফ</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
            </div>

            <button onClick={addOT} className="w-full bg-amber-500 text-white p-2 rounded-md font-medium text-sm hover:bg-amber-600">
              ওভারটাইম অ্যাড করুন
            </button>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 mb-2">এই সপ্তাহের ওভারটাইম ({weekOts.length})</h4>
            <ul className="space-y-2">
              {weekOts.map(o => {
                const s = staff.find(x => x.id === o.staffId);
                return (
                  <li key={o.id} className="p-3 border rounded-lg flex justify-between items-center text-sm bg-slate-50">
                    <div>
                      <p className="font-bold text-amber-600">শিফট: {o.shift} | পোস্ট: {o.postName}</p>
                      {s ? <p className="text-emerald-600 font-medium text-xs mt-1">ডিউটি: {s.name}</p> : <p className="text-slate-500 text-xs mt-1">স্টাফ: নির্ধারিত হয়নি</p>}
                    </div>
                    <button onClick={() => setOts(ots.filter(x => x.id !== o.id))} className="text-rose-500 p-1 hover:bg-rose-100 rounded">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </li>
                );
              })}
              {weekOts.length === 0 && <p className="text-sm text-slate-500">কোন ওভারটাইম নেই</p>}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
