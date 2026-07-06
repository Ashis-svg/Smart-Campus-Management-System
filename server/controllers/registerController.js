import { query } from '../config/db.js';
import {
  findStudentRecordSql,
  findExistingStudentLoginSql,
  insertStudentLoginSql,
  findAdminRecordSql,
  findExistingAdminLoginSql,
  insertAdminLoginSql,
} from '../queries/registerQueries.js';

const MIN_PASSWORD_LENGTH = 6;

// ── POST /student/register ────────────────────────────────────────────────────
// Body: { reg_no, email, password }
export const registerStudent = async (req, res) => {
  const { reg_no, email, password } = req.body;

  if (!reg_no?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ success: false, message: 'reg_no, email and password are required.' });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ success: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  }

  const reg_no_trimmed = reg_no.trim();
  const email_trimmed = email.trim();

  try {
    // Must match an existing enrollment record — this is the registration gate.
    const studentRows = await query(findStudentRecordSql, [reg_no_trimmed, email_trimmed]);
    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching student record found. Check your registration number and email, or contact administration.',
      });
    }

    // Already registered?
    const existing = await query(findExistingStudentLoginSql, [reg_no_trimmed]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This registration number is already registered. Please log in instead.',
      });
    }

    await query(insertStudentLoginSql, [reg_no_trimmed, email_trimmed, password]);

    res.json({ success: true, message: 'Registration successful. You can now log in.' });
  } catch (err) {
    console.error('registerStudent:', err);
    res.status(500).json({ success: false, message: 'Failed to register.' });
  }
};

// ── POST /admin/register ──────────────────────────────────────────────────────
// Body: { admin_id, email, password }
export const registerAdmin = async (req, res) => {
  const { admin_id, email, password } = req.body;

  if (!admin_id?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ success: false, message: 'admin_id, email and password are required.' });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ success: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  }

  const admin_id_trimmed = admin_id.trim();
  const email_trimmed = email.trim();

  try {
    const adminRows = await query(findAdminRecordSql, [admin_id_trimmed, email_trimmed]);
    if (adminRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching admin record found. Check your admin ID and email, or contact administration.',
      });
    }

    const existing = await query(findExistingAdminLoginSql, [admin_id_trimmed]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This admin ID is already registered. Please log in instead.',
      });
    }

    await query(insertAdminLoginSql, [admin_id_trimmed, email_trimmed, password]);

    res.json({ success: true, message: 'Registration successful. You can now log in.' });
  } catch (err) {
    console.error('registerAdmin:', err);
    res.status(500).json({ success: false, message: 'Failed to register.' });
  }
};