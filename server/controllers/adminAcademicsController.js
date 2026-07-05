import { query } from '../config/db.js';
import {
  todayClassesSql,
  tomorrowClassesSql,
  sectionForTodayClassSql,
  sectionForTomorrowClassSql,
  updateTodayClassSql,
  updateTomorrowClassSql,
  deleteTodayCancellationSql,
  deleteTomorrowCancellationSql,
  markPresentForCancelledTodaySql,
  markPresentForCancelledTomorrowSql,
  clearAutoAttendanceTodaySql,
  clearAutoAttendanceTomorrowSql,
  publishNoticeSql,
  myNoticeSql,
  deleteNoticeSql,
} from '../queries/adminAcademicsQueries.js';

// ── GET /admin/academics/:adminId ─────────────────────────────────────────────
// Returns this professor's own timetable for today/tomorrow (with cancellation
// status already merged in) plus their own notices.
export const getAcademicsDashboard = async (req, res) => {
  const admin_id = req.params.adminId;

  try {
    const [todayClasses, tomorrowClasses, notices] = await Promise.all([
      query(todayClassesSql, [admin_id]),
      query(tomorrowClassesSql, [admin_id]),
      query(myNoticeSql, [admin_id]),
    ]);

    res.json({
      success: true,
      todayClasses,
      tomorrowClasses,
      notices,
    });
  } catch (err) {
    console.error('getAcademicsDashboard:', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard.' });
  }
};

// ── PATCH /admin/academics/:adminId/class/:course_id/cancel ──────────────────
// Body: { day: 'today' | 'tomorrow' }
// Cancelling also auto-marks every student in the affected section present
// for this class, since a cancelled class shouldn't count against attendance.
export const cancelClass = async (req, res) => {
  const admin_id = req.params.adminId;
  const { course_id } = req.params;
  const { day } = req.body;

  if (!['today', 'tomorrow'].includes(day)) {
    return res.status(400).json({ success: false, message: "day must be 'today' or 'tomorrow'." });
  }

  const sectionSql = day === 'today' ? sectionForTodayClassSql          : sectionForTomorrowClassSql;
  const statusSql  = day === 'today' ? updateTodayClassSql              : updateTomorrowClassSql;
  const markSql    = day === 'today' ? markPresentForCancelledTodaySql  : markPresentForCancelledTomorrowSql;

  try {
    const sectionRows = await query(sectionSql, [admin_id, course_id]);
    if (sectionRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Class not found on your timetable for that day.' });
    }
    const { branch, sem, section } = sectionRows[0];

    const result = await query(statusSql, [admin_id, course_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Class not found on your timetable for that day.' });
    }

    await query(markSql, [course_id, branch, sem, section]);

    res.json({ success: true, message: 'Class cancelled — students auto-marked present.' });
  } catch (err) {
    console.error('cancelClass:', err);
    res.status(500).json({ success: false, message: 'Failed to cancel class.' });
  }
};

// ── PATCH /admin/academics/:adminId/class/:course_id/restore ─────────────────
// Body: { day: 'today' | 'tomorrow' }
// Restoring rolls back the attendance auto-marked when the class was
// cancelled (see caveat on clearAutoAttendanceTodaySql/TomorrowSql).
export const restoreClass = async (req, res) => {
  const admin_id = req.params.adminId;
  const { course_id } = req.params;
  const { day } = req.body;

  if (!['today', 'tomorrow'].includes(day)) {
    return res.status(400).json({ success: false, message: "day must be 'today' or 'tomorrow'." });
  }

  const sectionSql = day === 'today' ? sectionForTodayClassSql       : sectionForTomorrowClassSql;
  const deleteSql  = day === 'today' ? deleteTodayCancellationSql    : deleteTomorrowCancellationSql;
  const clearSql   = day === 'today' ? clearAutoAttendanceTodaySql   : clearAutoAttendanceTomorrowSql;

  try {
    const sectionRows = await query(sectionSql, [admin_id, course_id]);
    if (sectionRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Class not found on your timetable for that day.' });
    }
    const { branch, sem, section } = sectionRows[0];

    // param order matches the SQL: cs.c_id = ? first, then pt.admin_id = ?
    const result = await query(deleteSql, [course_id, admin_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No cancellation found for that class.' });
    }

    await query(clearSql, [course_id, branch, sem, section]);

    res.json({ success: true, message: 'Class restored.' });
  } catch (err) {
    console.error('restoreClass:', err);
    res.status(500).json({ success: false, message: 'Failed to restore class.' });
  }
};

// ── POST /admin/academics/:adminId/notice ─────────────────────────────────────
// Body: { title, notice }
export const publishNotice = async (req, res) => {
  const admin_id = req.params.adminId;
  const { title, notice } = req.body;

  if (!title?.trim() || !notice?.trim()) {
    return res.status(400).json({ success: false, message: 'Title and notice are required.' });
  }

  try {
    await query(publishNoticeSql, [admin_id, title.trim(), notice.trim()]);
    res.json({ success: true, message: 'Notice published.' });
  } catch (err) {
    console.error('publishNotice:', err);
    res.status(500).json({ success: false, message: 'Failed to publish notice.' });
  }
};

// ── DELETE /admin/academics/:adminId/notice/:notice_id ────────────────────────
export const deleteNotice = async (req, res) => {
  const admin_id = req.params.adminId;
  const { notice_id } = req.params;

  try {
    const result = await query(deleteNoticeSql, [notice_id, admin_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }
    res.json({ success: true, message: 'Notice deleted.' });
  } catch (err) {
    console.error('deleteNotice:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notice.' });
  }
};