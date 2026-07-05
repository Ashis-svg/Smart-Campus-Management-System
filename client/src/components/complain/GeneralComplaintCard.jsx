import React from 'react';
import { fmt } from '../../utils/formatDate';

const GeneralComplaintCard = ({ complaint: c, readOnly, onVote }) => {
  if (readOnly) {
    return (
      <div className="bg-white border-l-4 border-l-slate-200 border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2 flex-wrap">
          <span className="text-sm font-bold text-[#1e3a5f]">{c.name}</span>
          <span className="text-xs text-slate-400">Room {c.room_no}</span>
          <span className="text-xs text-slate-400">{c.floor}</span>
          <span className="text-xs text-slate-400 ml-auto">{fmt(c.complaint_date)}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed m-0">{c.complaint}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
        <span className="text-sm font-bold text-[#1e3a5f]">{c.name}</span>
        <span className="text-xs text-slate-400">Room {c.room_no}</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
          {c.floor}
        </span>
        <span className="text-xs text-slate-400 ml-auto">{fmt(c.complaint_date)}</span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-3">{c.complaint}</p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onVote(c.c_id, 'UPVOTE')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold border transition cursor-pointer
            ${c.myVote === 'UPVOTE'
              ? 'bg-blue-50 border-blue-400 text-blue-600'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500'}`}
        >
          ▲ {c.upvotes}
        </button>
        <button
          onClick={() => onVote(c.c_id, 'DOWNVOTE')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold border transition cursor-pointer
            ${c.myVote === 'DOWNVOTE'
              ? 'bg-rose-50 border-rose-400 text-rose-500'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-400'}`}
        >
          ▼ {c.downvotes}
        </button>
        <span className="text-xs text-slate-400 ml-1">
          net {c.upvotes - c.downvotes > 0 ? '+' : ''}{c.upvotes - c.downvotes}
        </span>
      </div>
    </div>
  );
};

export default GeneralComplaintCard;