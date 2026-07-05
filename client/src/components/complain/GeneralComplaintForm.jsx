import React from 'react';
import { FLOORS, CHAR_LIMIT } from '../../constants/complaintConstants';
import { inputCls, textareaCls } from './formStyles';

const GeneralComplaintForm = ({ gForm, setGForm, gSubmitting, onSubmit, title }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
      {title}
    </p>
    <form onSubmit={onSubmit} className="space-y-3">
      <select
        className={inputCls}
        value={gForm.floor}
        onChange={(e) => setGForm({ ...gForm, floor: e.target.value })}
      >
        <option value="">Select floor…</option>
        {FLOORS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      <div>
        <textarea
          className={textareaCls}
          placeholder="Describe the issue…"
          maxLength={CHAR_LIMIT}
          value={gForm.complaint}
          onChange={(e) => setGForm({ ...gForm, complaint: e.target.value })}
        />
        <p className={`text-xs text-right mt-1 ${gForm.complaint.length >= CHAR_LIMIT ? 'text-red-500' : 'text-slate-400'}`}>
          {gForm.complaint.length}/{CHAR_LIMIT}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={gSubmitting}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {gSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  </div>
);

GeneralComplaintForm.defaultProps = {
  title: 'Raise a General Complaint',
};

export default GeneralComplaintForm;