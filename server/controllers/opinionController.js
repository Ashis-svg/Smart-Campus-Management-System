import { query } from '../config/db.js';
import {
  addOpinionSql,
  updateOpinionSql,
  deleteOpinionSql,
  myOpinionsSql,
  allOpinionsSql,
  trendingOpinionsSql,
  upvoteSql,
  downvoteSql,
  myVoteSql,
} from '../queries/opinionQueries.js';

const VALID_USER_TYPES = ['STUDENT', 'ADMIN'];
const normalizeUserType = (userType) => userType?.toUpperCase();

// Attaches this caller's own vote (if any) to each opinion, without ever
// exposing anyone else's vote/identity — we only ever look up the vote
// belonging to (user_id, user_type) making the request.
const attachMyVote = async (opinions, user_id, user_type) =>
  Promise.all(
    opinions.map(async (op) => {
      const rows = await query(myVoteSql, [op.opinion_id, user_id, user_type]);
      return { ...op, myVote: rows.length > 0 ? rows[0].vote_type : null };
    })
  );

// ── GET /opinion/:userType/:userId ────────────────────────────────────────────
// Returns the anonymous public feed, the 7-day trending list (both with this
// caller's own vote state attached), and this caller's own opinions (which
// they can edit/delete).
export const getOpinionsDashboard = async (req, res) => {
  const user_id = req.params.userId;
  const user_type = normalizeUserType(req.params.userType);

  if (!VALID_USER_TYPES.includes(user_type)) {
    return res.status(400).json({ success: false, message: 'user_type must be STUDENT or ADMIN.' });
  }

  try {
    const [myOpinions, allOpinionsRaw, trendingOpinionsRaw] = await Promise.all([
      query(myOpinionsSql, [user_id, user_type]),
      query(allOpinionsSql),
      query(trendingOpinionsSql),
    ]);

    const [allOpinions, trendingOpinions] = await Promise.all([
      attachMyVote(allOpinionsRaw, user_id, user_type),
      attachMyVote(trendingOpinionsRaw, user_id, user_type),
    ]);

    res.json({
      success: true,
      myOpinions,
      allOpinions,
      trendingOpinions,
    });
  } catch (err) {
    console.error('getOpinionsDashboard:', err);
    res.status(500).json({ success: false, message: 'Failed to load opinions.' });
  }
};

// ── POST /opinion/:userType/:userId ───────────────────────────────────────────
// Body: { opinion_text }
export const addOpinion = async (req, res) => {
  const user_id = req.params.userId;
  const user_type = normalizeUserType(req.params.userType);
  const { opinion_text } = req.body;

  if (!VALID_USER_TYPES.includes(user_type)) {
    return res.status(400).json({ success: false, message: 'user_type must be STUDENT or ADMIN.' });
  }
  if (!opinion_text?.trim()) {
    return res.status(400).json({ success: false, message: 'Opinion text is required.' });
  }

  try {
    await query(addOpinionSql, [user_id, user_type, opinion_text.trim()]);
    res.json({ success: true, message: 'Opinion posted.' });
  } catch (err) {
    console.error('addOpinion:', err);
    res.status(500).json({ success: false, message: 'Failed to post opinion.' });
  }
};

// ── PATCH /opinion/:userType/:userId/:opinion_id ──────────────────────────────
// Body: { opinion_text }. Scoped to (opinion_id, user_id, user_type), so a
// person can only ever edit their own opinion.
export const updateOpinion = async (req, res) => {
  const user_id = req.params.userId;
  const user_type = normalizeUserType(req.params.userType);
  const { opinion_id } = req.params;
  const { opinion_text } = req.body;

  if (!opinion_text?.trim()) {
    return res.status(400).json({ success: false, message: 'Opinion text is required.' });
  }

  try {
    const result = await query(updateOpinionSql, [opinion_text.trim(), opinion_id, user_id, user_type]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Opinion not found.' });
    }
    res.json({ success: true, message: 'Opinion updated.' });
  } catch (err) {
    console.error('updateOpinion:', err);
    res.status(500).json({ success: false, message: 'Failed to update opinion.' });
  }
};

// ── DELETE /opinion/:userType/:userId/:opinion_id ─────────────────────────────
export const deleteOpinion = async (req, res) => {
  const user_id = req.params.userId;
  const user_type = normalizeUserType(req.params.userType);
  const { opinion_id } = req.params;

  try {
    const result = await query(deleteOpinionSql, [opinion_id, user_id, user_type]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Opinion not found.' });
    }
    res.json({ success: true, message: 'Opinion deleted.' });
  } catch (err) {
    console.error('deleteOpinion:', err);
    res.status(500).json({ success: false, message: 'Failed to delete opinion.' });
  }
};

// ── POST /opinion/:userType/:userId/vote ──────────────────────────────────────
// Body: { opinion_id, vote_type }  — vote_type must be 'UPVOTE' or 'DOWNVOTE'
export const voteOnOpinion = async (req, res) => {
  const user_id = req.params.userId;
  const user_type = normalizeUserType(req.params.userType);
  const { opinion_id, vote_type } = req.body;

  if (!VALID_USER_TYPES.includes(user_type)) {
    return res.status(400).json({ success: false, message: 'user_type must be STUDENT or ADMIN.' });
  }
  if (!opinion_id || !['UPVOTE', 'DOWNVOTE'].includes(vote_type)) {
    return res.status(400).json({ success: false, message: 'Invalid vote data.' });
  }

  try {
    const sql = vote_type === 'UPVOTE' ? upvoteSql : downvoteSql;
    await query(sql, [opinion_id, user_id, user_type]);
    res.json({ success: true, message: 'Vote recorded.' });
  } catch (err) {
    console.error('voteOnOpinion:', err);
    res.status(500).json({ success: false, message: 'Failed to record vote.' });
  }
};