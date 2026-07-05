import React from 'react';

const PERIOD_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const StatusBadge = ({ status }) => {
  const cancelled = status === 'CANCELLED';
  return (
    <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border
      ${cancelled
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
      {cancelled ? 'Cancelled' : 'Scheduled'}
    </span>
  );
};

const PeriodCard = ({ period }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 w-8">
          {PERIOD_LABELS[(period.period - 1) % 6]}
        </span>
        <span className="text-sm font-bold text-[#1e3a5f]">{period.subject}</span>
      </div>
      <StatusBadge status={period.status} />
    </div>
  </div>
);

const TimetableSection = ({ title, classes }) => (
  <section>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">{title}</p>
    {classes.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm bg-white border border-slate-200 rounded-xl">
        No classes scheduled.
      </div>
    ) : (
      classes.map((period, i) => <PeriodCard key={i} period={period} />)
    )}
  </section>
);

export default TimetableSection;