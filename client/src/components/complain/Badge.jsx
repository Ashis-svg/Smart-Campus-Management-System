import React from 'react';

const Badge = ({ resolved }) =>
  resolved ? (
    <span className="text-xs font-semibold uppercase tracking-wide px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
      Resolved
    </span>
  ) : (
    <span className="text-xs font-semibold uppercase tracking-wide px-3 py-0.5 rounded-full bg-amber-100 text-amber-700">
      Pending
    </span>
  );

export default Badge;