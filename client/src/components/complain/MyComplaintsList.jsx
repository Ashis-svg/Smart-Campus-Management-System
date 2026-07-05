import React from 'react';
import MyComplaintCard from './MyComplaintCard';
import ShowMoreButton from './ShowMoreButton';

const MyComplaintsList = ({ complaints, visible, onShowMore, onResolve, pageSize }) => (
  <>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 mt-7">
      My Submitted Complaints
    </p>

    {complaints.length === 0 ? (
      <div className="text-center py-12 text-slate-400 text-sm">
        You haven't raised any complaints yet.
      </div>
    ) : (
      <>
        {complaints.slice(0, visible).map((c) => (
          <MyComplaintCard key={c.c_id} complaint={c} onResolve={onResolve} />
        ))}
        <ShowMoreButton
          remaining={complaints.length - visible}
          onClick={() => onShowMore((v) => v + pageSize)}
        />
      </>
    )}
  </>
);

export default MyComplaintsList;