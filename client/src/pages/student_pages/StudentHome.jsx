import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FEATURES = [
  {
    label:       'Mess',
    description: 'View today\'s menu, mark attendance, and submit feedback.',
    path:        (id) => `/student/mess/${id}`,
    icon:        '🍽️',
    accent:      'border-emerald-200 hover:border-emerald-400',
    badge:       'bg-emerald-50 text-emerald-700',
  },
  {
    label:       'Complaint',
    description: 'Raise personal or general complaints and vote on community issues.',
    path:        (id) => `/student/complaint/${id}`,
    icon:        '📋',
    accent:      'border-blue-200 hover:border-blue-400',
    badge:       'bg-blue-50 text-blue-700',
  },
  {
    label:       'Academics',
    description: 'Check your timetable, results, and academic notices.',
    path:        (id) => `/student/academics/${id}`,
    icon:        '📚',
    accent:      'border-amber-200 hover:border-amber-400',
    badge:       'bg-amber-50 text-amber-700',
  },
  {
    label:       'Opinions',
    description: 'Share your thoughts and read what fellow students are saying.',
    path:        (id) => `/student/opinion/${id}`,
    icon:        '💬',
    accent:      'border-purple-200 hover:border-purple-400',
    badge:       'bg-purple-50 text-purple-700',
  },
];

const StudentHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-base opacity-75">Registration No: <span className="font-semibold">{id}</span></p>
      </div>

      {/* Feature cards */}
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-5">
          Quick Access
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <button
              key={f.label}
              onClick={() => navigate(f.path(id))}
              className={`text-left bg-white border-2 ${f.accent} rounded-2xl p-6 shadow-sm
                hover:shadow-md transition-all duration-150 cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{f.icon}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.badge}`}>
                  {f.label}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#1e3a5f] mb-1 group-hover:text-blue-600 transition-colors">
                {f.label}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StudentHome;