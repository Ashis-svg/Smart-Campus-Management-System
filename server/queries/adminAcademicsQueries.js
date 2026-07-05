// ============================================================================
// PROFESSOR TIMETABLE
// Cancellation status is merged in directly via LEFT JOIN so the frontend
// gets one row per class with a `cancelled` flag, instead of having to
// cross-reference two separate lists.
// ============================================================================
export const todayClassesSql = `
  SELECT
      pt.id,
      pt.course_id,
      c.subject_name,
      pt.branch,
      pt.sem,
      pt.section,
      IF(cs.status = 'CANCELLED', 1, 0) AS cancelled
  FROM professor_timetable pt
  JOIN course c
      ON pt.course_id = c.c_id
  LEFT JOIN class_status cs
      ON cs.c_id = pt.course_id
     AND cs.class_date = CURDATE()
  WHERE pt.admin_id = ?
  AND pt.day = DAYNAME(CURDATE())
  ORDER BY pt.id;
`;

export const tomorrowClassesSql = `
  SELECT
      pt.id,
      pt.course_id,
      c.subject_name,
      pt.branch,
      pt.sem,
      pt.section,
      IF(cs.status = 'CANCELLED', 1, 0) AS cancelled
  FROM professor_timetable pt
  JOIN course c
      ON pt.course_id = c.c_id
  LEFT JOIN class_status cs
      ON cs.c_id = pt.course_id
     AND cs.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
  WHERE pt.admin_id = ?
  AND pt.day = DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
  ORDER BY pt.id;
`;

// ============================================================================
// SECTION LOOKUP
// Used before cancelling/restoring a class: confirms the professor actually
// owns this course_id on this day, and tells us which (branch, sem, section)
// of students are affected so we know who to auto-mark attendance for.
// ============================================================================
export const sectionForTodayClassSql = `
  SELECT branch, sem, section
  FROM professor_timetable
  WHERE admin_id  = ?
    AND course_id = ?
    AND day       = DAYNAME(CURDATE())
  LIMIT 1;
`;

export const sectionForTomorrowClassSql = `
  SELECT branch, sem, section
  FROM professor_timetable
  WHERE admin_id  = ?
    AND course_id = ?
    AND day       = DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
  LIMIT 1;
`;

// ============================================================================
// UPDATE CLASS STATUS
// Every write below is scoped through professor_timetable so a professor can
// only cancel/restore a class that's actually theirs — admin_id is required
// and checked, not just trusted from the request.
// ============================================================================

// Cancel today's class. INSERT...SELECT only produces a row (and therefore
// only succeeds) if this admin_id actually teaches this course_id today.
export const updateTodayClassSql = `
  INSERT INTO class_status (class_date, c_id, status)
  SELECT CURDATE(), pt.course_id, 'CANCELLED'
  FROM professor_timetable pt
  WHERE pt.admin_id   = ?
    AND pt.course_id  = ?
    AND pt.day        = DAYNAME(CURDATE())
  LIMIT 1
  ON DUPLICATE KEY UPDATE status = VALUES(status);
`;

// Cancel tomorrow's class — same ownership check, shifted a day.
export const updateTomorrowClassSql = `
  INSERT INTO class_status (class_date, c_id, status)
  SELECT DATE_ADD(CURDATE(), INTERVAL 1 DAY), pt.course_id, 'CANCELLED'
  FROM professor_timetable pt
  WHERE pt.admin_id   = ?
    AND pt.course_id  = ?
    AND pt.day        = DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
  LIMIT 1
  ON DUPLICATE KEY UPDATE status = VALUES(status);
`;

// Remove cancellation (class will be taken after all). The JOIN enforces
// the same ownership check on the delete side.
export const deleteTodayCancellationSql = `
  DELETE cs FROM class_status cs
  JOIN professor_timetable pt
    ON pt.course_id = cs.c_id
   AND pt.day       = DAYNAME(CURDATE())
  WHERE cs.class_date = CURDATE()
    AND cs.c_id       = ?
    AND pt.admin_id   = ?;
`;

export const deleteTomorrowCancellationSql = `
  DELETE cs FROM class_status cs
  JOIN professor_timetable pt
    ON pt.course_id = cs.c_id
   AND pt.day       = DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
  WHERE cs.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND cs.c_id       = ?
    AND pt.admin_id   = ?;
`;

// ============================================================================
// AUTO-ATTENDANCE ON CANCELLATION
// When a class is cancelled, every student in that (branch, sem, section)
// gets auto-marked present for it — a cancelled class shouldn't count
// against anyone's attendance. If the cancellation is later undone, the
// auto-mark is rolled back.
// ============================================================================

export const markPresentForCancelledTodaySql = `
  INSERT INTO class_attendance (reg_no, course_id, attendance_date, attendance)
  SELECT sa.reg_no, ?, CURDATE(), 1
  FROM student_academics sa
  WHERE sa.branch = ?
    AND sa.sem    = ?
    AND sa.section= ?
  ON DUPLICATE KEY UPDATE attendance = VALUES(attendance);
`;

export const markPresentForCancelledTomorrowSql = `
  INSERT INTO class_attendance (reg_no, course_id, attendance_date, attendance)
  SELECT sa.reg_no, ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1
  FROM student_academics sa
  WHERE sa.branch = ?
    AND sa.sem    = ?
    AND sa.section= ?
  ON DUPLICATE KEY UPDATE attendance = VALUES(attendance);
`;

// Rolls back the auto-mark when a cancellation is undone.
// CAVEAT: class_attendance has no column distinguishing an auto-marked row
// from a manually-taken one, so this clears every attendance=1 row for this
// course/date/section — including any the professor may have manually
// entered in between. If that distinction matters, class_attendance would
// need an extra column (e.g. `auto_marked`) to track it.
export const clearAutoAttendanceTodaySql = `
  DELETE ca FROM class_attendance ca
  JOIN student_academics sa ON sa.reg_no = ca.reg_no
  WHERE ca.course_id = ?
    AND ca.attendance_date = CURDATE()
    AND sa.branch = ?
    AND sa.sem    = ?
    AND sa.section= ?
    AND ca.attendance = 1;
`;

export const clearAutoAttendanceTomorrowSql = `
  DELETE ca FROM class_attendance ca
  JOIN student_academics sa ON sa.reg_no = ca.reg_no
  WHERE ca.course_id = ?
    AND ca.attendance_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND sa.branch = ?
    AND sa.sem    = ?
    AND sa.section= ?
    AND ca.attendance = 1;
`;

// ============================================================================
// CLASS NOTICE
// ============================================================================

// Publish Notice
export const publishNoticeSql = `
  INSERT INTO class_notice
  (admin_id, title, notice)
  VALUES (?, ?, ?);
`;

// Professor's Notices
export const myNoticeSql = `
  SELECT
      notice_id,
      title,
      notice,
      notice_date
  FROM class_notice
  WHERE admin_id = ?
  ORDER BY notice_date DESC, notice_id DESC;
`;

// Delete Notice — already correctly scoped to admin_id, no change needed.
export const deleteNoticeSql = `
  DELETE FROM class_notice
  WHERE notice_id = ?
  AND admin_id = ?;
`;