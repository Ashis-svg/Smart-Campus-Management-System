import React from 'react';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const MessNoticeList = ({ notices }) => (
  <section>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
      Notices
    </p>
    {notices.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm">No notices yet.</div>
    ) : (
      notices.map((n) => (
        <div key={n.notice_id} className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-[#1e3a5f]">{n.title}</span>
            <span className="text-xs text-slate-400">{fmt(n.notice_date)}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{n.description}</p>
          {n.published_by && (
            <p className="text-xs text-slate-400 mt-2">— {n.published_by}</p>
          )}
        </div>
      ))
    )}
  </section>
);

export default MessNoticeList;