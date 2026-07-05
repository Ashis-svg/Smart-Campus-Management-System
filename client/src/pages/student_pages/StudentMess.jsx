import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMessData } from '../../hooks/useMessData';
import MenuSection from '../../components/mess/MenuSection';
import FeedbackForm from '../../components/mess/FeedbackForm';
import MessReport from '../../components/mess/MessReport';
import MessNoticeList from '../../components/mess/MessNoticeList';

const dayName = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString('en-US', { weekday: 'long' });

const StudentMess = () => {
  const { id } = useParams();
  const [tab, setTab] = useState('today');

  const {
    loading,
    hallNo,
    menu,
    attendance,
    totalAttendance,
    myRating,
    todayAverageRating,
    weeklyAverageRating,
    myTodayFeedback,
    todayFeedback,
    notices,
    submitFeedback,
    submitAttendance,
  } = useMessData(id);

  const today    = dayName(0);
  const tomorrow = dayName(1);

  const todayMenu    = menu.filter((m) => m.week_day === today);
  const tomorrowMenu = menu.filter((m) => m.week_day === tomorrow);

  const TABS = [
    { key: 'today',    label: "Today's Menu"    },
    { key: 'tomorrow', label: "Tomorrow's Menu"  },
    { key: 'feedback', label: 'Feedback'         },
    { key: 'report',   label: 'Mess Report'      },
    { key: 'notices',  label: 'Notices'          },
  ];

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
        <h1 className="text-xl font-bold tracking-tight m-0">Mess Portal</h1>
        <p className="text-sm opacity-75 mt-1">
          {today}
          {hallNo !== null && hallNo !== undefined && <> · Hall {hallNo}</>}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 px-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer bg-transparent
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
        {tab === 'today'    && <MenuSection title={`Menu for ${today}`}    meals={todayMenu}    />}
        {tab === 'tomorrow' && <MenuSection title={`Menu for ${tomorrow}`} meals={tomorrowMenu} showAttendance onAttendance={submitAttendance} />}
        {tab === 'feedback' && <FeedbackForm onSubmit={submitFeedback} currentRating={myRating} currentComment={myTodayFeedback} todayFeedback={todayFeedback} />}
        {tab === 'report'   && <MessReport myRating={myRating} myTodayFeedback={myTodayFeedback} todayAverageRating={todayAverageRating} weeklyAverageRating={weeklyAverageRating} totalAttendance={totalAttendance} attendance={attendance} />}
        {tab === 'notices'  && <MessNoticeList notices={notices} />}
      </div>

    </div>
  );
};

export default StudentMess;