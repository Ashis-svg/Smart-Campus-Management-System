import React, { useMemo, useState } from 'react';
import FloorSelector from './FloorSelector';
import GeneralComplaintRow from './GeneralComplaintRow';

const GeneralComplaintsPanel = ({ floors, floor, setFloor, generalList, loading, onResolve }) => {
  const [hideResolved, setHideResolved] = useState(true);

  const visibleList = useMemo(
    () => (hideResolved ? generalList.filter((c) => !c.resolve_date) : generalList),
    [generalList, hideResolved]
  );

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <FloorSelector floors={floors} floor={floor} onChange={setFloor} />
        <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hideResolved}
            onChange={(e) => setHideResolved(e.target.checked)}
            className="accent-blue-600"
          />
          Hide resolved
        </label>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Sorted by community votes — most-agreed-with issues on {floor} first.
      </p>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading…</div>
      ) : visibleList.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No {hideResolved ? 'unresolved ' : ''}complaints for {floor}.
        </div>
      ) : (
        visibleList.map((c) => (
          <GeneralComplaintRow key={c.c_id} complaint={c} onResolve={onResolve} />
        ))
      )}
    </div>
  );
};

export default GeneralComplaintsPanel;
