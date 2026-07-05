// =======================
// Student Details
// =======================

export const studentInfoSql = `
  SELECT name, room_no, hall_no
  FROM student
  WHERE reg_no = ?;
`;

// =======================
// Personal Complaint
// =======================

// hall_no is fetched automatically from student table
export const addComplaintSql = `
  INSERT INTO complaint
    (reg_no, hall_no, c_type, description)
  SELECT
    s.reg_no,
    s.hall_no,
    ?,
    ?
  FROM student s
  WHERE s.reg_no = ?;
`;

export const myComplaintSql = `
  SELECT
    c_id,
    c_type,
    description,
    c_date,
    resolve_date
  FROM complaint
  WHERE reg_no = ?
  ORDER BY c_date DESC, c_id DESC;
`;

export const resolveComplaintSql = `
  UPDATE complaint
  SET resolve_date = CURDATE()
  WHERE c_id = ?
    AND reg_no = ?;
`;

// =======================
// General Complaint
// =======================

// hall_no is fetched automatically from student table
export const addGeneralComplaintSql = `
  INSERT INTO general_complaint
    (floor, reg_no, hall_no, complaint)
  SELECT
    ?,
    s.reg_no,
    s.hall_no,
    ?
  FROM student s
  WHERE s.reg_no = ?;
`;

export const generalComplaintSql = `
  SELECT
    gc.c_id,
    gc.floor,
    gc.complaint,
    gc.complaint_date,
    gc.resolve_date,
    s.name,
    s.room_no,
    IFNULL(SUM(v.vote_type = 'UPVOTE'),0) AS upvotes,
    IFNULL(SUM(v.vote_type = 'DOWNVOTE'),0) AS downvotes
  FROM general_complaint gc
  JOIN student s
    ON gc.reg_no = s.reg_no
  LEFT JOIN vote_gen_comp v
    ON gc.c_id = v.c_id
  WHERE gc.hall_no = (
      SELECT hall_no
      FROM student
      WHERE reg_no = ?
  )
  GROUP BY
    gc.c_id,
    gc.floor,
    gc.complaint,
    gc.complaint_date,
    gc.resolve_date,
    s.name,
    s.room_no
  ORDER BY gc.c_id DESC;
`;

// =======================
// Voting
// =======================

export const upvoteSql = `
  INSERT INTO vote_gen_comp
    (c_id, reg_no, vote_type)
  VALUES (?, ?, 'UPVOTE')
  ON DUPLICATE KEY UPDATE
    vote_type = 'UPVOTE';
`;

export const downvoteSql = `
  INSERT INTO vote_gen_comp
    (c_id, reg_no, vote_type)
  VALUES (?, ?, 'DOWNVOTE')
  ON DUPLICATE KEY UPDATE
    vote_type = 'DOWNVOTE';
`;

export const myVoteSql = `
  SELECT vote_type
  FROM vote_gen_comp
  WHERE c_id = ?
    AND reg_no = ?;
`;