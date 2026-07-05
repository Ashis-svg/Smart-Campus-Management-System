import React, { useState } from 'react';

const OpinionComposer = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    await onSubmit(text.trim());
    setText('');
    setSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
        Share an Opinion — Posted Anonymously
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={4}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-y min-h-[90px] font-sans"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Posting…' : 'Post Opinion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpinionComposer;