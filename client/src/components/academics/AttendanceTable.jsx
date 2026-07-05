import React from 'react';

// attendance_percentage is the actual column name from the SQL —
// the old frontend used course.percentage which was wrong.
const AttendanceBar = ({ pct }) => {
  const safe = isNaN(pct) ? 0 : Math.min(100, Number(pct));
  const color = safe >= 75 ? 'bg-emerald-500' : safe >= 60 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${safe}%` }} />
      </div>
      <span className={`text-sm font-bold w-14 text-right
        ${safe >= 75 ? 'text-emerald-600' : safe >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
        {safe}%
      </span>
    </div>
  );
};

const AttendanceTable = ({ attendancePercentage }) => (
  <section>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
      Attendance Report
    </p>

    {attendancePercentage.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm bg-white border border-slate-200 rounded-xl">
        No attendance data available.
      </div>
    ) : (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
          <span className="col-span-5 text-xs font-bold uppercase tracking-wide text-slate-400">Subject</span>
          <span className="col-span-3 text-xs font-bold uppercase tracking-wide text-slate-400 text-center">Attended</span>
          <span className="col-span-4 text-xs font-bold uppercase tracking-wide text-slate-400">Progress</span>
        </div>

        {/* Rows */}
        {attendancePercentage.map((course, i) => (
          <div
            key={course.c_id ?? i}
            className={`grid grid-cols-12 gap-2 px-5 py-4 items-center
              ${i !== attendancePercentage.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className="col-span-5">
              <p className="text-sm font-semibold text-slate-700 leading-tight">{course.subject_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total: {course.no_of_classes} classes</p>
            </div>
            <div className="col-span-3 text-center">
              <span className="text-sm font-bold text-[#1e3a5f]">{course.attended_classes}</span>
              <span className="text-xs text-slate-400"> / {course.no_of_classes}</span>
            </div>
            <div className="col-span-4">
              <AttendanceBar pct={course.attendance_percentage} />
            </div>
          </div>
        ))}

        {/* Summary footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> ≥75% Safe
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 60–74% Warning
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt;60% Critical
          </span>
        </div>
      </div>
    )}
  </section>
);

export default AttendanceTable;