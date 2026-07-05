import React from 'react';

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">{children}</p>
);

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-2xl font-bold text-[#1e3a5f]">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

const AttendanceCard = ({ label, data }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{label}</p>
    <div className="space-y-2">
      {[['Breakfast', data.breakfast], ['Lunch', data.lunch], ['Dinner', data.dinner]].map(([meal, count]) => (
        <div key={meal} className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{meal}</span>
          <span className="text-sm font-bold text-[#1e3a5f]">{count}</span>
        </div>
      ))}
    </div>
  </div>
);

const MessReport = ({
  myRating,
  myTodayFeedback,
  todayAverageRating,
  weeklyAverageRating,
  totalAttendance,
  attendance,
}) => (
  <div className="space-y-8">

    {/* Ratings */}
    <div>
      <SectionLabel>Ratings</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="My Rating Today"        value={myRating          ? `${'⭐'.repeat(Number(myRating))}` : '—'} />
        <StatCard label="Today's Avg Rating"     value={todayAverageRating  ? `⭐ ${todayAverageRating}`  : '—'} />
        <StatCard label="Weekly Avg Rating"      value={weeklyAverageRating ? `⭐ ${weeklyAverageRating}` : '—'} sub="Last 7 days" />
      </div>
    </div>

    {/* Attendance */}
    <div>
      <SectionLabel>Attendance</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AttendanceCard label="My Attendance Today"    data={attendance}      />
        <AttendanceCard label="Total Hall Attendance"  data={totalAttendance} />
      </div>
    </div>

    {/* My comment */}
    {myTodayFeedback && (
      <div>
        <SectionLabel>My Comment Today</SectionLabel>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-600 leading-relaxed">{myTodayFeedback}</p>
        </div>
      </div>
    )}

  </div>
);

export default MessReport;