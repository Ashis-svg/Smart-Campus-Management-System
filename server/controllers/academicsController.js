import { query } from '../config/db.js';
import {
  todayTimeTableSql,
  tomorrowTimeTableSql,
  studentAttendanceSql,
  attendancePercentageSql,
  myNoticesSql,
} from '../queries/academicsQueries.js';

// The timetable SQL returns ONE pivoted row:
// { period1, period1_status, period2, period2_status, ... period6, period6_status }
// This helper reshapes it into a clean array the frontend can map over.
const reshapeTimetable = (rows) => {
  if (!rows || rows.length === 0) return [];
  const row = rows[0];
  const periods = [];
  for (let i = 1; i <= 6; i++) {
    const subject = row[`period${i}`];
    if (subject) {
      periods.push({
        period:  i,
        subject,
        status:  row[`period${i}_status`] ?? 'TAKEN',
      });
    }
  }
  return periods;
};

// GET /student/academics/:id
export const getAcademicsDashboard = async (req, res) => {
  const reg_no = req.params.id;

  try {
    const [todayRaw, tomorrowRaw, attendance, attendancePercentage, notices] = await Promise.all([
      query(todayTimeTableSql,      [reg_no]),
      query(tomorrowTimeTableSql,   [reg_no]),
      query(studentAttendanceSql,   [reg_no]),
      query(attendancePercentageSql,[reg_no]),
      query(myNoticesSql,           [reg_no]),
    ]);

    res.json({
      success:            true,
      todayClasses:       reshapeTimetable(todayRaw),
      tomorrowClasses:    reshapeTimetable(tomorrowRaw),
      attendance,
      attendancePercentage,
      notices,
    });
  } catch (err) {
    console.error('getAcademicsDashboard:', err);
    res.status(500).json({ success: false, message: 'Failed to load academics data.' });
  }
};