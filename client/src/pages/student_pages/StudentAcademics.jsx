import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAcademicsData } from '../../hooks/useAcademicsData';
import TimetableSection     from '../../components/academics/TimetableSection';
import AttendanceTable      from '../../components/academics/AttendanceTable';
import NoticeList           from '../../components/academics/NoticeList';

const dayName = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86_400_000)
    .toLocaleDateString('en-US', { weekday: 'long' });

const TABS = [
  { key: 'today',      label: "Today"       },
  { key: 'tomorrow',   label: "Tomorrow"    },
  { key: 'attendance', label: "Attendance"  },
  { key: 'notices',    label: "Notices"     },
];

const StudentAcademics = () => {
  const { id } = useParams();
  const [tab, setTab] = useState('today');

  const {
    loading,
    todayClasses,
    tomorrowClasses,
    attendancePercentage,
    notices,
  } = useAcademicsData(id);

  const today    = dayName(0);
  const tomorrow = dayName(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400 text-base">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-7">
        <h1 className="text-xl font-bold tracking-tight m-0">Academics</h1>
        <p className="text-sm opacity-75 mt-1">{today}</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 px-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap
              transition-colors cursor-pointer bg-transparent
              ${tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 pt-7">
        {tab === 'today'      && <TimetableSection title={`Today's Classes — ${today}`}      classes={todayClasses}    />}
        {tab === 'tomorrow'   && <TimetableSection title={`Tomorrow's Classes — ${tomorrow}`} classes={tomorrowClasses} />}
        {tab === 'attendance' && <AttendanceTable  attendancePercentage={attendancePercentage} />}
        {tab === 'notices'    && <NoticeList       notices={notices} />}
      </div>

    </div>
  );
};

export default StudentAcademics;