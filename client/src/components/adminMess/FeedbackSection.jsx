import React, { useState } from 'react';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '';

const FeedbackCard = ({ fb, showDate }) => (
  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3">
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm font-semibold text-[#1e3a5f]">{fb.name}</span>
      {showDate && <span className="text-xs text-slate-400">{fmt(fb.message_date)}</span>}
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">{fb.message}</p>
  </div>
);

const FeedbackSection = ({ todayFeedback, weekFeedback }) => {
  const [view, setView] = useState('today');

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Student Feedback</p>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {['today', 'week'].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer
                ${view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {v === 'today' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {(view === 'today' ? todayFeedback : weekFeedback).length === 0 ? (
        <p className="text-center py-8 text-slate-400 text-sm">No feedback yet.</p>
      ) : (
        (view === 'today' ? todayFeedback : weekFeedback).map((fb, i) => (
          <FeedbackCard key={i} fb={fb} showDate={view === 'week'} />
        ))
      )}
    </div>
  );
};

export default FeedbackSection;