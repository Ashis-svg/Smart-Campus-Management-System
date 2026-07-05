// ==============================
// HALLS
// ==============================

// Powers the hall selector the mess-manager admin sees before any
// dashboard data loads. Every query below is scoped to whichever
// hall_no the admin picks from this list.
export const listHallsSql = `
  SELECT DISTINCT hall_no
  FROM student
  WHERE hall_no IS NOT NULL
  ORDER BY hall_no;
`;

// ==============================
// ATTENDANCE
// ==============================

export const todayAttendanceSql = `
  SELECT
    IFNULL(SUM(breakfast), 0) AS breakfast,
    IFNULL(SUM(lunch),     0) AS lunch,
    IFNULL(SUM(dinner),    0) AS dinner
  FROM mess_attendance
  WHERE hall_no = ?
  AND attendance_date = CURDATE();
`;

export const weekAttendanceSql = `
  SELECT
    IFNULL(SUM(breakfast), 0) AS breakfast,
    IFNULL(SUM(lunch),     0) AS lunch,
    IFNULL(SUM(dinner),    0) AS dinner
  FROM mess_attendance
  WHERE hall_no = ?
  AND attendance_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE();
`;

// ==============================
// RATINGS
// ==============================

export const todayRatingSql = `
  SELECT ROUND(AVG(rating), 2) AS avg_rating
  FROM mess_rating
  WHERE hall_no = ?
  AND rating_date = CURDATE();
`;

export const weekRatingSql = `
  SELECT ROUND(AVG(rating), 2) AS avg_rating
  FROM mess_rating
  WHERE hall_no = ?
  AND rating_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE();
`;

// ==============================
// FEEDBACK
// ==============================

export const todayFeedbackSql = `
  SELECT s.name, s.reg_no, f.message
  FROM mess_feedback f
  JOIN student s ON f.reg_no = s.reg_no
  WHERE f.hall_no = ?
  AND f.message_date = CURDATE()
  ORDER BY f.id DESC;
`;

export const weekFeedbackSql = `
  SELECT s.name, s.reg_no, f.message, f.message_date
  FROM mess_feedback f
  JOIN student s ON f.reg_no = s.reg_no
  WHERE f.hall_no = ?
  AND f.message_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
  ORDER BY f.message_date DESC, f.id DESC;
`;

// ==============================
// MENU
// ==============================

export const todayMenuSql = `
  SELECT *
  FROM mess_menu
  WHERE hall_no  = ?
  AND week_day = DAYNAME(CURDATE())
  ORDER BY FIELD(meal, 'Breakfast', 'Lunch', 'Dinner');
`;

export const tomorrowMenuSql = `
  SELECT *
  FROM mess_menu
  WHERE hall_no  = ?
  AND week_day = DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
  ORDER BY FIELD(meal, 'Breakfast', 'Lunch', 'Dinner');
`;

export const updateMenuSql = `
  UPDATE mess_menu
  SET item1 = ?, item2 = ?, item3 = ?, item4 = ?, item5 = ?
  WHERE hall_no  = ?
    AND week_day = ?
    AND meal     = ?;
`;

// ==============================
// NOTICES
// ==============================
// NOTE: notice_table's current UNIQUE constraint is on notice_date alone,
// which means two different halls can't each publish a notice on the same
// date without colliding. See the accompanying migration to change that
// constraint to (hall_no, notice_date) before this will behave correctly.

export const allNoticeSql = `
  SELECT *
  FROM notice_table
  WHERE hall_no = ?
  ORDER BY notice_date DESC;
`;

export const insertNoticeSql = `
  INSERT INTO notice_table (hall_no, notice_date, title, description, created_by)
  VALUES (?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    title       = VALUES(title),
    description = VALUES(description),
    created_by  = VALUES(created_by);
`;

export const deleteNoticeSql = `
  DELETE FROM notice_table
  WHERE notice_id = ?
    AND hall_no   = ?;
`;