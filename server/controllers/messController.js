import { query } from '../config/db.js';
import {
  studentHallSql,
  menuSql,
  attendanceSql,
  totalAttendanceSql,
  myRatingSql,
  todayAvgRatingSql,
  weekAvgRatingSql,
  myTodayFeedbackSql,
  myWeekFeedbackSql,
  todayFeedbackSql,
  weekFeedbackSql,
  hallNoticesSql,
  insertAttendanceSql,
  insertRatingSql,
  insertFeedbackSql,
} from '../queries/messQueries.js';

const firstOrNull = (rows) => (rows.length > 0 ? rows[0] : null);

// Every request is scoped to a single reg_no, and every hall-wide stat
// (total attendance, avg rating, community feedback) needs that student's
// hall_no rather than the whole system's. Resolve it once up front so both
// handlers can reuse it.
const getHallNo = async (reg_no) => {
  const rows = await query(studentHallSql, [reg_no]);
  return rows.length > 0 ? rows[0].hall_no : null;
};

export const getMessDashboard = async (req, res) => {
  const reg_no = req.params.id;

  try {
    const hall_no = await getHallNo(reg_no);
    if (hall_no === null) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Independent queries run in parallel instead of one-after-another.
    const [
      menu,
      attendance,
      totalAttendance,
      myRating,
      todayAvg,
      weekAvg,
      myTodayFeedback,
      myWeekFeedback,
      todayFeedback,
      weekFeedback,
      notices,
    ] = await Promise.all([
      query(menuSql, [reg_no]),
      query(attendanceSql, [reg_no]),
      query(totalAttendanceSql, [hall_no]),
      query(myRatingSql, [reg_no]),
      query(todayAvgRatingSql, [hall_no]),
      query(weekAvgRatingSql, [hall_no]),
      query(myTodayFeedbackSql, [reg_no]),
      query(myWeekFeedbackSql, [reg_no]),
      query(todayFeedbackSql, [hall_no]),
      query(weekFeedbackSql, [hall_no]),
      query(hallNoticesSql, [hall_no]),
    ]);

    res.json({
      success: true,
      hallNo: hall_no,
      menu,
      attendance: firstOrNull(attendance),
      totalAttendance: firstOrNull(totalAttendance),
      myRating: firstOrNull(myRating),
      todayAverageRating: firstOrNull(todayAvg),
      weeklyAverageRating: firstOrNull(weekAvg),
      myTodayFeedback: firstOrNull(myTodayFeedback),
      myWeekFeedback,
      todayFeedback,
      weekFeedback,
      notices,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMessDashboard = async (req, res) => {
  const reg_no = req.params.id;
  const { attendence, formData } = req.body;

  try {
    const hall_no = await getHallNo(reg_no);
    if (hall_no === null) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Attendance — only act on a properly-formed [meal, status] pair.
    // This guards against the old bug where an empty/undefined attendence
    // value was silently treated as truthy and written as a "dinner" row.
    if (Array.isArray(attendence) && attendence.length === 2) {
      const [meal, status] = attendence;
      const columnByMeal = {
        Breakfast: 'breakfast',
        Lunch: 'lunch',
        Dinner: 'dinner',
      };
      const column = columnByMeal[meal];

      if (column && (status === 0 || status === 1)) {
        await query(insertAttendanceSql(column), [reg_no, hall_no, status]);
      }
    }

    // Rating
    if (formData && formData.rating) {
      await query(insertRatingSql, [reg_no, hall_no, formData.rating]);
    }

    // Feedback
    if (formData && formData.comment && formData.comment.trim() !== '') {
      await query(insertFeedbackSql, [reg_no, hall_no, formData.comment]);
    }

    res.json({
      success: true,
      message: 'Data saved successfully.',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Failed to save data.' });
  }
};