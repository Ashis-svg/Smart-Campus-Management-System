import React, { useState } from 'react';
import PersonalComplaintRow from './PersonalComplaintRow (1)';

const SUB_TABS = [
  { key: 'unresolved', label: 'Unresolved' },
  { key: 'resolved', label: 'Resolved' },
];

const PersonalComplaintsPanel = ({ unresolved, resolved, loading, onResolve }) => {
  const [subTab, setSubTab] = useState('unresolved');
  const list = subTab === 'unresolved' ? unresolved : resolved;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {SUB_TABS.map(({ key, label }) => {
          const count = key === 'unresolved' ? unresolved.length : resolved.length;
          return (
            <button
              key={key}
              onClick={() => setSubTab(key)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full border transition cursor-pointer
                ${subTab === key
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading…</div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          {subTab === 'unresolved' ? 'No unresolved complaints. 🎉' : 'No resolved complaints yet.'}
        </div>
      ) : (
        list.map((c) => (
          <PersonalComplaintRow key={c.c_id} complaint={c} onResolve={onResolve} />
        ))
      )}
    </div>
  );
};

export default PersonalComplaintsPanel;
