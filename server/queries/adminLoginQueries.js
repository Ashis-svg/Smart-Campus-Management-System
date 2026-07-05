// ==========================
// ADMIN LOGIN
// ==========================

export const adminLoginSql = `
SELECT
    a.admin_id,
    a.name,
    a.email,
    ar.role
FROM admin a
JOIN admin_login al
    ON a.admin_id = al.admin_id
JOIN admin_role ar
    ON a.admin_id = ar.admin_id
WHERE
    a.admin_id = ?
    AND al.password = ?;
`;