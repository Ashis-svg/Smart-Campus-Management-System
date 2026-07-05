// ==============================
// HALLS
// ==============================
// Same shape as the mess dashboard's hall selector — kept as its own copy
// here (rather than importing from adminMessQueries.js) so the complaint
// feature doesn't depend on the mess feature existing.
export const listHallsSql = `
  SELECT DISTINCT hall_no
  FROM student
  WHERE hall_no IS NOT NULL
  ORDER BY hall_no;
`;

// ==============================
// PERSONAL COMPLAINTS (table: complaint)
// ==============================
export const unresolvedPersonalSql = `
  SELECT
    c.c_id, c.reg_no, c.c_type, c.description, c.c_date, c.resolve_date,
    s.name, s.room_no
  FROM complaint c
  JOIN student s ON s.reg_no = c.reg_no
  WHERE c.hall_no = ?
    AND c.resolve_date IS NULL
  ORDER BY c.c_date DESC;
`;

export const resolvedPersonalSql = `
  SELECT
    c.c_id, c.reg_no, c.c_type, c.description, c.c_date, c.resolve_date,
    s.name, s.room_no
  FROM complaint c
  JOIN student s ON s.reg_no = c.reg_no
  WHERE c.hall_no = ?
    AND c.resolve_date IS NOT NULL
  ORDER BY c.resolve_date DESC;
`;

export const resolvePersonalSql = `
  UPDATE complaint
  SET resolve_date = CURDATE()
  WHERE c_id = ?
    AND hall_no = ?
    AND resolve_date IS NULL;
`;

// ==============================
// GENERAL COMPLAINTS (table: general_complaint + vote_gen_comp)
// ==============================
// Scoped to one hall AND one floor at a time — the admin picks the floor
// from a dropdown on the client. Sorted by net votes (upvotes - downvotes)
// so the most-agreed-with issues surface first, then by recency.
export const generalComplaintsByFloorSql = `
  SELECT
    g.c_id, g.floor, g.reg_no, g.complaint, g.complaint_date, g.resolve_date,
    s.name, s.room_no,
    IFNULL(SUM(v.vote_type = 'UPVOTE'), 0)   AS upvotes,
    IFNULL(SUM(v.vote_type = 'DOWNVOTE'), 0) AS downvotes
  FROM general_complaint g
  JOIN student s           ON s.reg_no = g.reg_no
  LEFT JOIN vote_gen_comp v ON v.c_id = g.c_id
  WHERE g.hall_no = ?
    AND g.floor   = ?
  GROUP BY g.c_id, g.floor, g.reg_no, g.complaint, g.complaint_date, g.resolve_date, s.name, s.room_no
  ORDER BY
    (IFNULL(SUM(v.vote_type = 'UPVOTE'), 0) - IFNULL(SUM(v.vote_type = 'DOWNVOTE'), 0)) DESC,
    g.complaint_date DESC;
`;

export const resolveGeneralSql = `
  UPDATE general_complaint
  SET resolve_date = CURDATE()
  WHERE c_id = ?
    AND hall_no = ?
    AND resolve_date IS NULL;
`;
