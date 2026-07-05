import React from 'react';

const VoteButton = ({ active, onClick, label, activeCls }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer
      ${active ? activeCls : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
  >
    {label}
  </button>
);

const OpinionFeedCard = ({ opinion, onVote, rank }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm flex items-start gap-4">
    {rank != null && (
      <span className="text-lg font-bold text-slate-300 w-6 text-center shrink-0">{rank}</span>
    )}
    <div className="flex-1">
      <p className="text-sm text-slate-700 leading-relaxed">{opinion.opinion_text}</p>
      <div className="flex items-center gap-2 mt-3">
        <VoteButton
          active={opinion.myVote === 'UPVOTE'}
          onClick={() => onVote(opinion.opinion_id, 'UPVOTE')}
          label={`▲ ${opinion.upvotes}`}
          activeCls="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
        <VoteButton
          active={opinion.myVote === 'DOWNVOTE'}
          onClick={() => onVote(opinion.opinion_id, 'DOWNVOTE')}
          label={`▼ ${opinion.downvotes}`}
          activeCls="text-red-500 bg-red-50 border-red-200"
        />
        <span className="text-xs text-slate-400 ml-auto">Score: {opinion.score}</span>
      </div>
    </div>
  </div>
);

export default OpinionFeedCard;