import React from 'react';

const TABS = [
  { key: 'personal', label: 'My Complaints' },
  { key: 'general', label: 'General Complaints' },
];

const ComplaintTabs = ({ tab, setTab }) => (
  <div className="flex bg-white border-b border-slate-200 px-8">
    {TABS.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => setTab(key)}
        className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer bg-transparent
          ${tab === key
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'}`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default ComplaintTabs;