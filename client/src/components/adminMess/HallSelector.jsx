import React from 'react';

const HallSelector = ({ halls, hallNo, onChange }) => (
  <div className="flex items-center gap-3 bg-white border-b border-slate-200 px-8 py-3.5">
    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
      Managing Hall
    </label>
    <select
      value={hallNo ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1e3a5f] bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
    >
      {halls.map((h) => (
        <option key={h} value={h}>Hall {h}</option>
      ))}
    </select>
  </div>
);

export default HallSelector;