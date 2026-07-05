import React, { useState } from 'react';

const inputCls = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const AcademicsNoticeSection = ({ notices, onPublish, onDelete }) => {
  const [form, setForm] = useState({ title: '', notice: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.notice.trim()) return;
    setSubmitting(true);
    await onPublish(form);
    setForm({ title: '', notice: '' });
    setSubmitting(false);
  };

  return (
    <>
      {/* Create form */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Publish a Class Notice
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title…" className={inputCls}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea rows={4} placeholder="Notice…"
            className={`${inputCls} resize-y min-h-[90px] font-sans`}
            value={form.notice}
            onChange={(e) => setForm({ ...form, notice: e.target.value })}
          />
          <div className="flex justify-end">
            <button type="submit" disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer">
              {submitting ? 'Publishing…' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </div>

      {/* Notice list */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        My Notices
      </p>
      {notices.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No notices yet.</div>
      ) : (
        notices.map((n) => (
          <div key={n.notice_id} className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#1e3a5f]">{n.title}</span>
                  <span className="text-xs text-slate-400">{fmt(n.notice_date)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{n.notice}</p>
              </div>
              <button onClick={() => onDelete(n.notice_id)}
                className="shrink-0 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default AcademicsNoticeSection;