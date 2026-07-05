import React, { useState } from 'react';

import { useOpinionData } from '../../hooks/useOpinionData';
import OpinionComposer from './OpinionComposer';
import OpinionFeedCard from './OpinionFeedCard';
import MyOpinionCard   from './MyOpinionCard';

const TABS = [
  { key: 'all',       label: 'All Opinions'  },
  { key: 'trending',  label: 'Trending'      },
  { key: 'mine',      label: 'My Opinions'   },
];

// userType: 'STUDENT' | 'ADMIN', userId: reg_no or admin_id
const OpinionBoard = ({ userType, userId }) => {
  const [tab, setTab] = useState('all');

  const {
    loading, toast,
    myOpinions, allOpinions, trendingOpinions,
    addOpinion, updateOpinion, deleteOpinion, vote,
  } = useOpinionData(userType, userId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-7">
        <h1 className="text-xl font-bold tracking-tight m-0">Campus Opinions</h1>
        <p className="text-sm opacity-75 mt-1">Anonymous — nobody can see who posted what.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 px-8 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap
              transition-colors cursor-pointer bg-transparent
              ${tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 pt-7">
        {tab === 'all' && (
          <>
            <OpinionComposer onSubmit={addOpinion} />
            {allOpinions.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-sm">No opinions yet — be the first to share one.</p>
            ) : (
              allOpinions.map((op) => (
                <OpinionFeedCard key={op.opinion_id} opinion={op} onVote={vote} />
              ))
            )}
          </>
        )}

        {tab === 'trending' && (
          <>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Top 5 from the Last 7 Days
            </p>
            {trendingOpinions.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-sm">Nothing trending this week yet.</p>
            ) : (
              trendingOpinions.map((op, i) => (
                <OpinionFeedCard key={op.opinion_id} opinion={op} onVote={vote} rank={i + 1} />
              ))
            )}
          </>
        )}

        {tab === 'mine' && (
          <>
            {myOpinions.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-sm">You haven't posted any opinions yet.</p>
            ) : (
              myOpinions.map((op) => (
                <MyOpinionCard
                  key={op.opinion_id}
                  opinion={op}
                  onUpdate={updateOpinion}
                  onDelete={deleteOpinion}
                />
              ))
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-7 right-7 z-50 px-5 py-3 rounded-xl text-sm font-medium
          text-white shadow-lg animate-[slidein_0.2s_ease]
          ${toast.ok ? 'bg-[#1e3a5f]' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes slidein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default OpinionBoard;