import React, { useState } from 'react';

const inputCls = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

const RATINGS = [
  { value: '1', label: '⭐ 1 — Poor'      },
  { value: '2', label: '⭐⭐ 2 — Fair'     },
  { value: '3', label: '⭐⭐⭐ 3 — Good'   },
  { value: '4', label: '⭐⭐⭐⭐ 4 — Very Good' },
  { value: '5', label: '⭐⭐⭐⭐⭐ 5 — Excellent' },
];

const FeedbackForm = ({ onSubmit, currentRating, currentComment, todayFeedback = [] }) => {
  const [formData, setFormData] = useState({ rating: currentRating || '', comment: currentComment || '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <>
      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Rate &amp; Comment
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select name="rating" value={formData.rating} onChange={handleChange} className={inputCls}>
            <option value="">Select rating…</option>
            {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            placeholder="Write your feedback…"
            className={`${inputCls} resize-y min-h-[90px] font-sans`}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>

      {/* My submitted feedback */}
      {(currentRating || currentComment) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            My Feedback Today
          </p>
          {currentRating && (
            <p className="text-sm text-slate-600 mb-2">
              Rating: <span className="font-semibold text-amber-500">{'⭐'.repeat(Number(currentRating))}</span>
            </p>
          )}
          {currentComment && (
            <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
              {currentComment}
            </p>
          )}
        </div>
      )}

      {/* Community comments */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 mt-7">
        Student Comments Today
      </p>
      {todayFeedback.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No comments yet today.</div>
      ) : (
        todayFeedback.map((fb, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
            <p className="text-sm text-slate-600 leading-relaxed">{fb.message}</p>
            <p className="text-xs text-slate-400 mt-2">{fb.name}</p>
          </div>
        ))
      )}
    </>
  );
};

export default FeedbackForm;