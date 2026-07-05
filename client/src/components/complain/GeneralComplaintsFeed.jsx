import React from 'react';
import GeneralComplaintCard from './GeneralComplaintCard';
import ShowMoreButton from './ShowMoreButton';

const GeneralComplaintsFeed = ({
  complaints,
  visible,
  onShowMore,
  onVote,
  readOnly,
  title,
  subtitle,
  emptyText,
  pageSize,
}) => (
  <>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 mt-8">
      {title}
    </p>
    {subtitle && <p className="text-xs text-slate-400 mb-4">{subtitle}</p>}

    {complaints.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm">{emptyText}</div>
    ) : (
      <>
        {complaints.slice(0, visible).map((c) => (
          <GeneralComplaintCard key={c.c_id} complaint={c} readOnly={readOnly} onVote={onVote} />
        ))}
        <ShowMoreButton
          remaining={complaints.length - visible}
          onClick={() => onShowMore((v) => v + pageSize)}
        />
      </>
    )}
  </>
);

GeneralComplaintsFeed.defaultProps = {
  readOnly: false,
  title: "All Students' Complaints",
  subtitle: null,
  emptyText: 'No complaints raised yet.',
};

export default GeneralComplaintsFeed;