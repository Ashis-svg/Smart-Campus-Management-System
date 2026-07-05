import db from "../config/db.js";
import { adminLoginSql } from "../queries/adminLoginQueries.js";

// =======================================
// STUDENT LOGIN
// =======================================
export const login = (req, res) => {
  const { reg_no, password } = req.body;

  const studentLoginSql = `
    SELECT *
    FROM student_login
    WHERE reg_no = ?
      AND password = ?;
  `;

  db.query(studentLoginSql, [reg_no, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    return res.json({
      success: true,
      student: result[0],
    });
  });
};

// =======================================
// ADMIN LOGIN
// =======================================
export const adminLogin = (req, res) => {
  const { admin_id, password } = req.body;

  db.query(adminLoginSql, [admin_id, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin ID or Password",
      });
    }

    // Create roles array
    const roles = result.map((row) => row.role);

    const admin = {
      admin_id: result[0].admin_id,
      name: result[0].name,
      email: result[0].email,
      roles: roles,
    };

    return res.json({
      success: true,
      admin,
    });
  });
};