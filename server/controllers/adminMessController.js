import { query } from '../config/db.js';
import {
  listHallsSql,
  todayAttendanceSql,
  weekAttendanceSql,
  todayRatingSql,
  weekRatingSql,
  todayFeedbackSql,
  weekFeedbackSql,
  todayMenuSql,
  tomorrowMenuSql,
  updateMenuSql,
  allNoticeSql,
  insertNoticeSql,
  deleteNoticeSql,
} from '../queries/adminMessQueries.js';

// ── GET /admin/mess/halls ──────────────────────────────────────────────────────
// Powers the hall selector shown before any dashboard data loads.
export const getHalls = async (req, res) => {
  try {
    const rows = await query(listHallsSql);
    res.json({ success: true, halls: rows.map((r) => r.hall_no) });
  } catch (err) {
    console.error('getHalls:', err);
    res.status(500).json({ success: false, message: 'Failed to load halls.' });
  }
};

// ── GET /admin/mess/:adminId?hall_no=… ─────────────────────────────────────────
// Returns everything the dashboard needs, scoped to the selected hall.
export const getAdminMessDashboard = async (req, res) => {
  const hall_no = req.query.hall_no ? Number(req.query.hall_no) : null;

  if (!hall_no) {
    return res.status(400).json({ success: false, message: 'hall_no is required.' });
  }

  try {
    const [
      todayAttendance,
      weekAttendance,
      todayRating,
      weekRating,
      todayFeedback,
      weekFeedback,
      todayMenu,
      tomorrowMenu,
      notices,
    ] = await Promise.all([
      query(todayAttendanceSql, [hall_no]),
      query(weekAttendanceSql, [hall_no]),
      query(todayRatingSql, [hall_no]),
      query(weekRatingSql, [hall_no]),
      query(todayFeedbackSql, [hall_no]),
      query(weekFeedbackSql, [hall_no]),
      query(todayMenuSql, [hall_no]),
      query(tomorrowMenuSql, [hall_no]),
      query(allNoticeSql, [hall_no]),
    ]);

    res.json({
      success:          true,
      hallNo:           hall_no,
      todayAttendance:  todayAttendance[0]  ?? null,
      weekAttendance:   weekAttendance[0]   ?? null,
      todayRating:      todayRating[0]      ?? null,
      weekRating:       weekRating[0]       ?? null,
      todayFeedback,
      weekFeedback,
      todayMenu,
      tomorrowMenu,
      notices,
    });
  } catch (err) {
    console.error('getAdminMessDashboard:', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard.' });
  }
};

// ── POST /admin/mess/:adminId/notice ──────────────────────────────────────────
// Body: { hall_no, notice_date, title, description }
export const publishNotice = async (req, res) => {
  const adminId = req.params.adminId;
  const { hall_no, notice_date, title, description } = req.body;

  if (!hall_no || !notice_date || !title?.trim() || !description?.trim()) {
    return res.status(400).json({ success: false, message: 'hall_no and all fields are required.' });
  }

  try {
    await query(insertNoticeSql, [hall_no, notice_date, title.trim(), description.trim(), adminId]);
    res.json({ success: true, message: 'Notice published.' });
  } catch (err) {
    console.error('publishNotice:', err);
    res.status(500).json({ success: false, message: 'Failed to publish notice.' });
  }
};

// ── DELETE /admin/mess/:adminId/notice/:notice_id?hall_no=… ───────────────────
// hall_no is required so an admin can only delete notices belonging to the
// hall they currently have selected.
export const deleteNotice = async (req, res) => {
  const { notice_id } = req.params;
  const hall_no = req.query.hall_no ? Number(req.query.hall_no) : null;

  if (!hall_no) {
    return res.status(400).json({ success: false, message: 'hall_no is required.' });
  }

  try {
    const result = await query(deleteNoticeSql, [notice_id, hall_no]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }
    res.json({ success: true, message: 'Notice deleted.' });
  } catch (err) {
    console.error('deleteNotice:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notice.' });
  }
};

// ── PATCH /admin/mess/:adminId/menu ───────────────────────────────────────────
// Body: { hall_no, week_day, meal, item1, item2, item3, item4, item5 }
export const updateMenu = async (req, res) => {
  const { hall_no, week_day, meal, item1, item2, item3, item4, item5 } = req.body;

  if (!hall_no || !week_day || !meal) {
    return res.status(400).json({ success: false, message: 'hall_no, week_day and meal are required.' });
  }

  try {
    const result = await query(updateMenuSql, [
      item1 ?? null, item2 ?? null, item3 ?? null, item4 ?? null, item5 ?? null,
      hall_no, week_day, meal,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Menu entry not found.' });
    }
    res.json({ success: true, message: 'Menu updated.' });
  } catch (err) {
    console.error('updateMenu:', err);
    res.status(500).json({ success: false, message: 'Failed to update menu.' });
  }
};