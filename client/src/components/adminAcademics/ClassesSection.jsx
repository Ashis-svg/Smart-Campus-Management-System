import React from 'react';

const ClassCard = ({ cls, day, onToggle }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-[#1e3a5f]">{cls.subject_name}</p>
      <p className="text-xs text-slate-400 mt-0.5">
        {cls.branch} · Sem {cls.sem} · Section {cls.section}
      </p>
      {!!cls.cancelled && (
        <span className="inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wide text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
          Cancelled
        </span>
      )}
    </div>
    <button
      onClick={() => onToggle(cls.course_id, day, !!cls.cancelled)}
      className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer whitespace-nowrap
        ${cls.cancelled
          ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
          : 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100'}`}
    >
      {cls.cancelled ? '↺ Restore Class' : '✕ Cancel Class'}
    </button>
  </div>
);

const ClassesSection = ({ todayClasses, tomorrowClasses, onToggle }) => (
  <div className="space-y-8">
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        Today's Classes
      </p>
      {todayClasses.length === 0 ? (
        <p className="text-center py-8 text-slate-400 text-sm">No classes scheduled today.</p>
      ) : (
        todayClasses.map((cls) => (
          <ClassCard key={cls.id} cls={cls} day="today" onToggle={onToggle} />
        ))
      )}
    </div>

    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        Tomorrow's Classes
      </p>
      {tomorrowClasses.length === 0 ? (
        <p className="text-center py-8 text-slate-400 text-sm">No classes scheduled tomorrow.</p>
      ) : (
        tomorrowClasses.map((cls) => (
          <ClassCard key={cls.id} cls={cls} day="tomorrow" onToggle={onToggle} />
        ))
      )}
    </div>
  </div>
);

export default ClassesSection;