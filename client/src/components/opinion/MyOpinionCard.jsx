import React, { useState } from 'react';

const fmt = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const MyOpinionCard = ({ opinion, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(opinion.opinion_text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = () => {
    setText(opinion.opinion_text);
    setEditing(true);
  };

  const cancelEdit = () => {
    setText(opinion.opinion_text);
    setEditing(false);
  };

  const saveEdit = async () => {
    if (!text.trim() || text.trim() === opinion.opinion_text) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onUpdate(opinion.opinion_id, text.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this opinion? This can\'t be undone.')) return;
    setDeleting(true);
    await onDelete(opinion.opinion_id);
    // no need to reset `deleting` — parent removes this card once the list reloads
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
      {editing ? (
        <div className="space-y-3">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-y min-h-[90px] font-sans"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="px-4 py-1.5 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={saving || !text.trim()}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-700 leading-relaxed">{opinion.opinion_text}</p>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs text-emerald-600 font-semibold">▲ {opinion.upvotes}</span>
            <span className="text-xs text-red-500 font-semibold">▼ {opinion.downvotes}</span>
            <span className="text-xs text-slate-400">Score: {opinion.score}</span>
            <span className="text-xs text-slate-400">Posted: {fmt(opinion.opinion_date)}</span>

            <div className="ml-auto flex gap-2">
              <button
                onClick={startEdit}
                className="px-3.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3.5 py-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOpinionCard;