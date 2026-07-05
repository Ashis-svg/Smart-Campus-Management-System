import React from 'react';

const StatCard = ({ label, value, sub, accent }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
    <p className={`text-2xl font-bold ${accent ?? 'text-[#1e3a5f]'}`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const AttendanceCard = ({ label, data }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">{label}</p>
    {[['Breakfast', data?.breakfast], ['Lunch', data?.lunch], ['Dinner', data?.dinner]].map(([meal, count]) => (
      <div key={meal} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-sm text-slate-500">{meal}</span>
        <span className="text-sm font-bold text-[#1e3a5f]">{count ?? 0}</span>
      </div>
    ))}
  </div>
);

const StatsRow = ({ todayAttendance, weekAttendance, todayRating, weekRating }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <AttendanceCard label="Today's Attendance"  data={todayAttendance} />
    <AttendanceCard label="Weekly Attendance"   data={weekAttendance}  />
    <StatCard label="Today's Avg Rating"  value={todayRating?.avg_rating ? `⭐ ${todayRating.avg_rating}` : '—'} accent="text-amber-500" />
    <StatCard label="Weekly Avg Rating"   value={weekRating?.avg_rating  ? `⭐ ${weekRating.avg_rating}`  : '—'} accent="text-amber-500" sub="Last 7 days" />
  </div>
);

export default StatsRow;