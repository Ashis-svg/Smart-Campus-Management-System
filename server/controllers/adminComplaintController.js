import { query } from '../config/db.js';
import {
  listHallsSql,
  unresolvedPersonalSql,
  resolvedPersonalSql,
  resolvePersonalSql,
  generalComplaintsByFloorSql,
  resolveGeneralSql,
} from '../queries/adminComplaintQueries.js';

// ── GET /admin/complaint/halls ─────────────────────────────────────────────
export const getHalls = async (req, res) => {
  try {
    const rows = await query(listHallsSql);
    res.json({ success: true, halls: rows.map((r) => r.hall_no) });
  } catch (err) {
    console.error('getHalls:', err);
    res.status(500).json({ success: false, message: 'Failed to load halls.' });
  }
};

// ── GET /admin/complaint/:adminId?hall_no=… ────────────────────────────────
// Returns the personal complaints for the hall, already split into
// unresolved / resolved so the client doesn't have to partition them.
export const getPersonalComplaints = async (req, res) => {
  const hall_no = req.query.hall_no ? Number(req.query.hall_no) : null;

  if (!hall_no) {
    return res.status(400).json({ success: false, message: 'hall_no is required.' });
  }

  try {
    const [unresolved, resolved] = await Promise.all([
      query(unresolvedPersonalSql, [hall_no]),
      query(resolvedPersonalSql, [hall_no]),
    ]);

    res.json({ success: true, hallNo: hall_no, unresolved, resolved });
  } catch (err) {
    console.error('getPersonalComplaints:', err);
    res.status(500).json({ success: false, message: 'Failed to load complaints.' });
  }
};

// ── PATCH /admin/complaint/:adminId/resolve/:c_id?hall_no=… ───────────────
export const resolvePersonalComplaint = async (req, res) => {
  const { c_id } = req.params;
  const hall_no = req.query.hall_no ? Number(req.query.hall_no) : null;

  if (!hall_no) {
    return res.status(400).json({ success: false, message: 'hall_no is required.' });
  }

  try {
    const result = await query(resolvePersonalSql, [c_id, hall_no]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found or already resolved.' });
    }
    res.json({ success: true, message: 'Complaint marked as resolved.' });
  } catch (err) {
    console.error('resolvePersonalComplaint:', err);
    res.status(500).json({ success: false, message: 'Failed to resolve complaint.' });
  }
};

// ── GET /admin/complaint/:adminId/general?hall_no=…&floor=… ───────────────
// Fetched separately from the personal complaints so switching floors in
// the dropdown doesn't require reloading everything else.
export const getGeneralComplaints = async (req, res) => {
  const hall_no = req.query.hall_no ? Number(req.query.hall_no) : null;
  const { floor } = req.query;

  if (!hall_no || !floor) {
    return res.status(400).json({ success: false, message: 'hall_no and floor are required.' });
  }

  try {
    const complaints = await query(generalComplaintsByFloorSql, [hall_no, floor]);
    res.json({ success: true, hallNo: hall_no, floor, complaints });
  } catch (err) {
    console.error('getGeneralComplaints:', err);
    res.status(500).json({ success: false, message: 'Failed to load general complaints.' });
  }
};

// ── PATCH /admin/complaint/:adminId/general/:c_id/resolve?hall_no=… ───────
export const resolveGeneralComplaint = async (req, res) => {
  const { c_id } = req.params;
  const hall_no = req.query.hall_no ? Number(req.query.hall_no) : null;

  if (!hall_no) {
    return res.status(400).json({ success: false, message: 'hall_no is required.' });
  }

  try {
    const result = await query(resolveGeneralSql, [c_id, hall_no]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found or already resolved.' });
    }
    res.json({ success: true, message: 'Complaint marked as resolved.' });
  } catch (err) {
    console.error('resolveGeneralComplaint:', err);
    res.status(500).json({ success: false, message: 'Failed to resolve complaint.' });
  }
};
