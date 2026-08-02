import { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, Users, ClipboardList, Download, LayoutDashboard, Settings, Clock4 } from 'lucide-react';
import { generateWeeklyRoster } from './utils/rosterAlgorithm';
import { RosterTable } from './components/RosterTable';
import { useAppState } from './hooks/useAppState';
import { Dashboard } from './components/Dashboard';
import { StaffManager } from './components/StaffManager';
import { PostManager } from './components/PostManager';
import { LeaveOTManager } from './components/LeaveOTManager';

import { parseLocalDate, formatDate, getEndDate, formatDisplayDate } from './utils/dateUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roster' | 'staff' | 'posts' | 'leave_ot'>('dashboard');
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = (day === 6) ? 0 : (day + 1);
    d.setDate(d.getDate() - diff);
    return formatDate(d);
  });
  
  const prevWeekRef = useRef(weekNumber);
  useEffect(() => {
    if (weekNumber !== prevWeekRef.current) {
      const diffWeeks = weekNumber - prevWeekRef.current;
      const d = parseLocalDate(startDate);
      d.setDate(d.getDate() + diffWeeks * 7);
      setStartDate(formatDate(d));
      prevWeekRef.current = weekNumber;
    }
  }, [weekNumber, startDate]);
  
  const { staff, setStaff, posts, setPosts, leaves, setLeaves, ots, setOts } = useAppState();

  const roster = useMemo(() => {
    return generateWeeklyRoster(weekNumber, startDate, staff, posts, leaves, ots);
  }, [weekNumber, startDate, staff, posts, leaves, ots]);

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'roster', label: 'সাপ্তাহিক রোস্টার', icon: ClipboardList },
    { id: 'staff', label: 'স্টাফ ম্যানেজমেন্ট', icon: Users },
    { id: 'posts', label: 'পোস্ট ম্যানেজমেন্ট', icon: Settings },
    { id: 'leave_ot', label: 'ছুটি ও ওভারটাইম', icon: Clock4 },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-0 md:h-16 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">সিকিউরিটি রোস্টার প্রো</h1>
            </div>
            <nav className="flex space-x-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && <Dashboard staff={staff} posts={posts} leaves={leaves} ots={ots} />}
        
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">অ্যালগরিদম রোস্টার জেনারেটর</h2>
                <p className="text-sm text-slate-500 mt-1">
                  অটোমেটিক রোটেশন এবং ছুটি/ওভারটাইম হিসাব করে রোস্টার তৈরি করা হয়েছে।
                </p>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                  <label htmlFor="weekSelect" className="text-sm font-medium text-slate-700">সপ্তাহ:</label>
                  <select 
                    id="weekSelect"
                    className="bg-transparent border-none text-sm font-bold text-indigo-700 focus:ring-0 cursor-pointer p-0 pr-6"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                  <label htmlFor="startDate" className="text-sm font-medium text-slate-700">শুরুর তারিখ (শনিবার):</label>
                  <div className="relative flex items-center">
                    <span className="text-sm font-bold text-indigo-700 pointer-events-none">
                      {formatDisplayDate(startDate)}
                    </span>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-slate-500">হতে</span>
                  <span className="text-sm font-bold text-indigo-700">
                    {formatDisplayDate(getEndDate(startDate))}
                  </span>
                </div>
                
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  প্রিন্ট / PDF
                </button>
              </div>
            </div>

            <RosterTable roster={roster} weekNumber={weekNumber} startDate={startDate} />
          </div>
        )}

        {activeTab === 'staff' && <StaffManager staff={staff} setStaff={setStaff} posts={posts} />}
        
        {activeTab === 'posts' && <PostManager posts={posts} setPosts={setPosts} />}
        
        {activeTab === 'leave_ot' && <LeaveOTManager staff={staff} posts={posts} leaves={leaves} setLeaves={setLeaves} ots={ots} setOts={setOts} />}
      </main>
    </div>
  );
}
