import { query } from '../config/db.js';
import {
  studentInfoSql,
  addComplaintSql,
  myComplaintSql,
  resolveComplaintSql,
  addGeneralComplaintSql,
  generalComplaintSql,
  upvoteSql,
  downvoteSql,
  myVoteSql,
} from '../queries/complaintQueries.js';

// ─── GET /student/complaint/:id ────────────────────────────────────────────────
// Returns student info + personal complaints + general complaints with my vote
export const getComplaintDashboard = async (req, res) => {
  const reg_no = req.params.id;

  try {
    const [studentInfo, myComplaints, generalComplaints] = await Promise.all([
      query(studentInfoSql,    [reg_no]),
      query(myComplaintSql,    [reg_no]),
      query(generalComplaintSql, [reg_no]),
    ]);

    // Attach this student's vote to each general complaint
    const complaintsWithVotes = await Promise.all(
      generalComplaints.map(async (complaint) => {
        const rows = await query(myVoteSql, [complaint.c_id, reg_no]);
        return {
          ...complaint,
          myVote: rows.length > 0 ? rows[0].vote_type : null,
        };
      })
    );

    res.json({
      success:          true,
      student:          studentInfo[0] ?? null,
      myComplaints,
      generalComplaints: complaintsWithVotes,
    });
  } catch (err) {
    console.error('getComplaintDashboard:', err);
    res.status(500).json({ success: false, message: 'Failed to load data.' });
  }
};

// ─── POST /student/complaint/:id ───────────────────────────────────────────────
// Body: { c_type, description }
export const addPersonalComplaint = async (req, res) => {
  const reg_no = req.params.id;
  const { c_type, description } = req.body;

  if (!c_type || !description?.trim()) {
    return res.status(400).json({ success: false, message: 'Type and description are required.' });
  }

  if (description.trim().length > 250) {
    return res.status(400).json({ success: false, message: 'Description exceeds 250 characters.' });
  }

  try {
    // Placeholder order in addComplaintSql is (c_type, description, reg_no) —
    // reg_no only appears last, in the WHERE clause that resolves hall_no.
    await query(addComplaintSql, [c_type, description.trim(), reg_no]);
    res.json({ success: true, message: 'Complaint submitted.' });
  } catch (err) {
    console.error('addPersonalComplaint:', err);
    res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
};

// ─── PATCH /student/complaint/:id/resolve/:c_id ────────────────────────────────
export const resolveComplaint = async (req, res) => {
  const { id: reg_no, c_id } = req.params;

  try {
    const result = await query(resolveComplaintSql, [c_id, reg_no]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found or already resolved.' });
    }

    res.json({ success: true, message: 'Complaint marked as resolved.' });
  } catch (err) {
    console.error('resolveComplaint:', err);
    res.status(500).json({ success: false, message: 'Failed to resolve complaint.' });
  }
};

// ─── POST /student/complaint/:id/general ──────────────────────────────────────
// Body: { floor, complaint }
export const addGeneralComplaint = async (req, res) => {
  const reg_no = req.params.id;
  const { floor, complaint } = req.body;

  if (!floor || !complaint?.trim()) {
    return res.status(400).json({ success: false, message: 'Floor and complaint are required.' });
  }

  if (complaint.trim().length > 250) {
    return res.status(400).json({ success: false, message: 'Complaint exceeds 250 characters.' });
  }

  try {
    // Placeholder order in addGeneralComplaintSql is (floor, complaint, reg_no) —
    // reg_no only appears last, in the WHERE clause that resolves hall_no.
    await query(addGeneralComplaintSql, [floor, complaint.trim(), reg_no]);
    res.json({ success: true, message: 'General complaint submitted.' });
  } catch (err) {
    console.error('addGeneralComplaint:', err);
    res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
};

// ─── POST /student/complaint/:id/vote ─────────────────────────────────────────
// Body: { c_id, vote_type }  — vote_type must be 'UPVOTE' or 'DOWNVOTE'
export const voteOnComplaint = async (req, res) => {
  const reg_no = req.params.id;
  const { c_id, vote_type } = req.body;

  if (!c_id || !['UPVOTE', 'DOWNVOTE'].includes(vote_type)) {
    return res.status(400).json({ success: false, message: 'Invalid vote data.' });
  }

  try {
    const sql = vote_type === 'UPVOTE' ? upvoteSql : downvoteSql;
    await query(sql, [c_id, reg_no]);
    res.json({ success: true, message: 'Vote recorded.' });
  } catch (err) {
    console.error('voteOnComplaint:', err);
    res.status(500).json({ success: false, message: 'Failed to record vote.' });
  }
};