import React from 'react';

const AttendanceRow = ({ meal, onAttendance }) => (
  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
      Will you attend {meal}?
    </span>
    <button
      onClick={() => onAttendance(meal, 1)}
      className="ml-auto px-4 py-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
    >
      ✓ Yes
    </button>
    <button
      onClick={() => onAttendance(meal, 0)}
      className="px-4 py-1.5 text-sm font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition cursor-pointer"
    >
      ✗ No
    </button>
  </div>
);

export default AttendanceRow;