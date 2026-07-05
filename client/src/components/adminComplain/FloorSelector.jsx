import React from 'react';

const FloorSelector = ({ floors, floor, onChange }) => (
  <div className="flex items-center gap-3">
    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
      Floor
    </label>
    <select
      value={floor ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1e3a5f] bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
    >
      {floors.map((f) => (
        <option key={f} value={f}>{f}</option>
      ))}
    </select>
  </div>
);

export default FloorSelector;
