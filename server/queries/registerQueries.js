// ======================================================
// STUDENT REGISTRATION
// ======================================================

// The registration gate: reg_no + email must match an existing enrollment
// record before a login can be created. This is what stops anyone who isn't
// an actual enrolled student from registering.
export const findStudentRecordSql = `
  SELECT reg_no, email
  FROM student
  WHERE reg_no = ?
    AND email = ?;
`;

// Has this reg_no already registered a login?
export const findExistingStudentLoginSql = `
  SELECT reg_no
  FROM student_login
  WHERE reg_no = ?;
`;

export const insertStudentLoginSql = `
  INSERT INTO student_login (reg_no, email, password)
  VALUES (?, ?, ?);
`;

// ======================================================
// ADMIN REGISTRATION
// ======================================================

export const findAdminRecordSql = `
  SELECT admin_id, email
  FROM admin
  WHERE admin_id = ?
    AND email = ?;
`;

export const findExistingAdminLoginSql = `
  SELECT admin_id
  FROM admin_login
  WHERE admin_id = ?;
`;

export const insertAdminLoginSql = `
  INSERT INTO admin_login (admin_id, email, password)
  VALUES (?, ?, ?);
`;