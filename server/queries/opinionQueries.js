// ======================================================
// ADD OPINION
// ======================================================

export const addOpinionSql = `
  INSERT INTO opinion
    (user_id, user_type, opinion_text)
  VALUES (?, ?, ?);
`;

// ======================================================
// UPDATE MY OPINION
// ======================================================

export const updateOpinionSql = `
  UPDATE opinion
  SET opinion_text = ?
  WHERE opinion_id = ?
    AND user_id = ?
    AND user_type = ?;
`;

// ======================================================
// DELETE MY OPINION
// ======================================================

export const deleteOpinionSql = `
  DELETE FROM opinion
  WHERE opinion_id = ?
    AND user_id = ?
    AND user_type = ?;
`;

// ======================================================
// MY OPINIONS
// ======================================================
// Note: intentionally NOT ordered by score — this is "my" list, meant to be
// browsed chronologically so the person can find something to edit/delete.

export const myOpinionsSql = `
  SELECT
      o.opinion_id,
      o.opinion_text,
      o.opinion_date,

      IFNULL(SUM(v.vote_type='UPVOTE'),0) AS upvotes,
      IFNULL(SUM(v.vote_type='DOWNVOTE'),0) AS downvotes,

      (
        IFNULL(SUM(v.vote_type='UPVOTE'),0)
        -
        IFNULL(SUM(v.vote_type='DOWNVOTE'),0)
      ) AS score

  FROM opinion o

  LEFT JOIN opinion_vote v
    ON o.opinion_id = v.opinion_id

  WHERE o.user_id = ?
    AND o.user_type = ?

  GROUP BY
      o.opinion_id,
      o.opinion_text,
      o.opinion_date

  ORDER BY
      o.opinion_date DESC,
      o.opinion_id DESC;
`;

// ======================================================
// ALL OPINIONS
// ======================================================
// Deliberately selects nothing that could identify the author — no
// user_id/user_type — so the feed stays anonymous no matter who's viewing.

export const allOpinionsSql = `
  SELECT
      o.opinion_id,
      o.opinion_text,
      o.opinion_date,

      IFNULL(SUM(v.vote_type='UPVOTE'),0) AS upvotes,
      IFNULL(SUM(v.vote_type='DOWNVOTE'),0) AS downvotes,

      (
        IFNULL(SUM(v.vote_type='UPVOTE'),0)
        -
        IFNULL(SUM(v.vote_type='DOWNVOTE'),0)
      ) AS score

  FROM opinion o

  LEFT JOIN opinion_vote v
    ON o.opinion_id = v.opinion_id

  GROUP BY
      o.opinion_id,
      o.opinion_text,
      o.opinion_date

  ORDER BY
      score DESC,
      o.opinion_date DESC,
      o.opinion_id DESC;
`;

// ======================================================
// TRENDING OPINIONS (LAST 7 DAYS)
// ======================================================

export const trendingOpinionsSql = `
  SELECT
      o.opinion_id,
      o.opinion_text,
      o.opinion_date,

      IFNULL(SUM(v.vote_type='UPVOTE'),0) AS upvotes,
      IFNULL(SUM(v.vote_type='DOWNVOTE'),0) AS downvotes,

      (
        IFNULL(SUM(v.vote_type='UPVOTE'),0)
        -
        IFNULL(SUM(v.vote_type='DOWNVOTE'),0)
      ) AS score

  FROM opinion o

  LEFT JOIN opinion_vote v
    ON o.opinion_id = v.opinion_id

  WHERE o.opinion_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)

  GROUP BY
      o.opinion_id,
      o.opinion_text,
      o.opinion_date

  ORDER BY
      score DESC,
      o.opinion_date DESC,
      o.opinion_id DESC

  LIMIT 5;
`;

// ======================================================
// UPVOTE / DOWNVOTE
// Require a UNIQUE key on (opinion_id, user_id, user_type) in opinion_vote —
// see migrate_opinion_vote_unique_key.sql — otherwise ON DUPLICATE KEY
// UPDATE below silently does nothing and every vote inserts a new row.
// ======================================================

export const upvoteSql = `
  INSERT INTO opinion_vote
    (opinion_id, user_id, user_type, vote_type)
  VALUES (?, ?, ?, 'UPVOTE')

  ON DUPLICATE KEY UPDATE
    vote_type = 'UPVOTE';
`;

export const downvoteSql = `
  INSERT INTO opinion_vote
    (opinion_id, user_id, user_type, vote_type)
  VALUES (?, ?, ?, 'DOWNVOTE')

  ON DUPLICATE KEY UPDATE
    vote_type = 'DOWNVOTE';
`;

// ======================================================
// USER'S VOTE ON AN OPINION
// ======================================================

export const myVoteSql = `
  SELECT vote_type
  FROM opinion_vote
  WHERE opinion_id = ?
    AND user_id = ?
    AND user_type = ?;
`;