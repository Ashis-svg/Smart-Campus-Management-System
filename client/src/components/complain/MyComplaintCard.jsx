import React from 'react';
import Badge from './Badge';
import { fmt } from '../../utils/formatDate';

const MyComplaintCard = ({ complaint, onResolve }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
    <div className="flex justify-between items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-sm font-bold text-[#1e3a5f]">{complaint.c_type}</span>
          <Badge resolved={!!complaint.resolve_date} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed m-0">{complaint.description}</p>
        <div className="flex gap-4 flex-wrap mt-2">
          <span className="text-xs text-slate-400">Filed: {fmt(complaint.c_date)}</span>
          {complaint.resolve_date && (
            <span className="text-xs text-slate-400">Resolved: {fmt(complaint.resolve_date)}</span>
          )}
        </div>
      </div>
      {!complaint.resolve_date && (
        <button
          onClick={() => onResolve(complaint.c_id)}
          className="shrink-0 px-4 py-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
        >
          ✓ Mark Resolved
        </button>
      )}
    </div>
  </div>
);

export default MyComplaintCard;