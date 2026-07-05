import React from 'react';
import { fmt } from '../../utils/formatDate';

const GeneralComplaintRow = ({ complaint: c, onResolve }) => {
  const net = c.upvotes - c.downvotes;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="text-sm font-bold text-[#1e3a5f]">{c.name}</span>
            <span className="text-xs text-slate-400">Room {c.room_no}</span>
            {c.resolve_date && (
              <span className="text-xs font-semibold uppercase tracking-wide px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Resolved
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto">{fmt(c.complaint_date)}</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-2">{c.complaint}</p>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-emerald-600 font-semibold">▲ {c.upvotes}</span>
            <span className="text-rose-500 font-semibold">▼ {c.downvotes}</span>
            <span className="text-xs text-slate-400">
              net {net > 0 ? '+' : ''}{net}
            </span>
          </div>
        </div>

        {!c.resolve_date && (
          <button
            onClick={() => onResolve(c.c_id)}
            className="shrink-0 px-4 py-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
          >
            ✓ Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default GeneralComplaintRow;
