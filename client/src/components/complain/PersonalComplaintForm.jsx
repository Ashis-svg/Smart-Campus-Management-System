import React from 'react';
import { COMPLAINT_TYPES, CHAR_LIMIT } from '../../constants/complaintConstants';
import { inputCls, textareaCls } from './formStyles';

const PersonalComplaintForm = ({ pForm, setPForm, pSubmitting, onSubmit }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
      Raise a Complaint
    </p>
    <form onSubmit={onSubmit} className="space-y-3">
      <select
        className={inputCls}
        value={pForm.c_type}
        onChange={(e) => setPForm({ ...pForm, c_type: e.target.value })}
      >
        <option value="">Select type…</option>
        {COMPLAINT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div>
        <textarea
          className={textareaCls}
          placeholder="Describe your complaint…"
          maxLength={CHAR_LIMIT}
          value={pForm.description}
          onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
        />
        <p className={`text-xs text-right mt-1 ${pForm.description.length >= CHAR_LIMIT ? 'text-red-500' : 'text-slate-400'}`}>
          {pForm.description.length}/{CHAR_LIMIT}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pSubmitting}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {pSubmitting ? 'Submitting…' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  </div>
);

export default PersonalComplaintForm;