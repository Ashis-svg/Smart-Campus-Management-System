import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAdminAcademicsData } from '../../hooks/useAdminAcademicsData';
import ClassesSection from '../../components/adminAcademics/ClassesSection';
import NoticeSection  from '../../components/adminAcademics/AcademicsNoticesection';

const TABS = [
  { key: 'classes', label: 'Classes' },
  { key: 'notices', label: 'Notices' },
];

const AdminAcademics = () => {
  // Route param is :id (see AdminNavbar / other admin pages), aliased here
  // for readability.
  const { id: adminId } = useParams();
  const [tab, setTab] = useState('classes');

  const {
    loading, toast,
    todayClasses, tomorrowClasses,
    notices,
    toggleClass,
    publishNotice, deleteNotice,
  } = useAdminAcademicsData(adminId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-7">
        <h1 className="text-xl font-bold tracking-tight m-0">Admin — Academics</h1>
        <p className="text-sm opacity-75 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
      </div>

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
      <div className="max-w-3xl mx-auto px-6 pt-7">
        {tab === 'classes' && (
          <ClassesSection
            todayClasses={todayClasses}
            tomorrowClasses={tomorrowClasses}
            onToggle={toggleClass}
          />
        )}
        {tab === 'notices' && (
          <NoticeSection
            notices={notices}
            onPublish={publishNotice}
            onDelete={deleteNotice}
          />
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

export default AdminAcademics;