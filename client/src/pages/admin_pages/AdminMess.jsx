import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAdminMessData } from '../../hooks/useAdminMessData';
import HallSelector    from '../../components/adminMess/HallSelector';
import StatsRow        from '../../components/adminMess/StatsRow';
import FeedbackSection from '../../components/adminMess/FeedbackSection';
import MenuSection     from '../../components/adminMess/MenuSection';
import NoticeSection   from '../../components/adminMess/NoticeSection';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'feedback',  label: 'Feedback'  },
  { key: 'menu',      label: 'Menu'      },
  { key: 'notices',   label: 'Notices'   },
];

const AdminMess = () => {
  const { id: adminId } = useParams();
  const [tab, setTab] = useState('dashboard');

  const {
    loading, hallsLoading, toast,
    halls, hallNo, setHallNo,
    todayAttendance, weekAttendance,
    todayRating, weekRating,
    todayFeedback, weekFeedback,
    todayMenu, tomorrowMenu,
    notices,
    publishNotice, deleteNotice, updateMenu,
  } = useAdminMessData(adminId);

  if (hallsLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  if (!hallNo) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400 text-sm text-center px-6">
        No halls found. Make sure students have a hall_no assigned before managing mess data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-7">
        <h1 className="text-xl font-bold tracking-tight m-0">Admin — Mess Management</h1>
        <p className="text-sm opacity-75 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
      </div>

      {/* Hall selector — everything below is scoped to this hall */}
      <HallSelector halls={halls} hallNo={hallNo} onChange={setHallNo} />

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 px-8 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap
              transition-colors cursor-pointer bg-transparent
              ${tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 pt-7">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading hall data…</div>
        ) : (
          <>
            {tab === 'dashboard' && (
              <StatsRow
                todayAttendance={todayAttendance}
                weekAttendance={weekAttendance}
                todayRating={todayRating}
                weekRating={weekRating}
              />
            )}
            {tab === 'feedback' && (
              <FeedbackSection
                todayFeedback={todayFeedback}
                weekFeedback={weekFeedback}
              />
            )}
            {tab === 'menu' && (
              <MenuSection
                todayMenu={todayMenu}
                tomorrowMenu={tomorrowMenu}
                onUpdateMenu={updateMenu}
              />
            )}
            {tab === 'notices' && (
              <NoticeSection
                notices={notices}
                onPublish={publishNotice}
                onDelete={deleteNotice}
              />
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-7 right-7 z-50 px-5 py-3 rounded-xl text-sm font-medium
          text-white shadow-lg animate-[slidein_0.2s_ease]
          ${toast.ok ? 'bg-[#1e3a5f]' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes slidein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default AdminMess;