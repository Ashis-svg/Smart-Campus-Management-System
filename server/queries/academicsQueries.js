// ===============================
// ACADEMICS QUERIES
// ===============================

// 1. Today's Timetable
export const todayTimeTableSql = `
SELECT
    tt.day,

    c1.subject_name AS period1,
    COALESCE(cs1.status,'TAKEN') AS period1_status,

    c2.subject_name AS period2,
    COALESCE(cs2.status,'TAKEN') AS period2_status,

    c3.subject_name AS period3,
    COALESCE(cs3.status,'TAKEN') AS period3_status,

    c4.subject_name AS period4,
    COALESCE(cs4.status,'TAKEN') AS period4_status,

    c5.subject_name AS period5,
    COALESCE(cs5.status,'TAKEN') AS period5_status,

    c6.subject_name AS period6,
    COALESCE(cs6.status,'TAKEN') AS period6_status

FROM student_academics sa

JOIN time_table tt
ON sa.sem = tt.sem
AND sa.branch = tt.branch
AND sa.section = tt.section

LEFT JOIN course c1 ON tt.period1 = c1.c_id
LEFT JOIN course c2 ON tt.period2 = c2.c_id
LEFT JOIN course c3 ON tt.period3 = c3.c_id
LEFT JOIN course c4 ON tt.period4 = c4.c_id
LEFT JOIN course c5 ON tt.period5 = c5.c_id
LEFT JOIN course c6 ON tt.period6 = c6.c_id

LEFT JOIN class_status cs1
ON cs1.c_id = tt.period1
AND cs1.class_date = CURDATE()

LEFT JOIN class_status cs2
ON cs2.c_id = tt.period2
AND cs2.class_date = CURDATE()

LEFT JOIN class_status cs3
ON cs3.c_id = tt.period3
AND cs3.class_date = CURDATE()

LEFT JOIN class_status cs4
ON cs4.c_id = tt.period4
AND cs4.class_date = CURDATE()

LEFT JOIN class_status cs5
ON cs5.c_id = tt.period5
AND cs5.class_date = CURDATE()

LEFT JOIN class_status cs6
ON cs6.c_id = tt.period6
AND cs6.class_date = CURDATE()

WHERE sa.reg_no = ?
AND tt.day = DAYNAME(CURDATE());
`;

// 2. Tomorrow's Timetable
export const tomorrowTimeTableSql = `
SELECT
    tt.day,

    c1.subject_name AS period1,
    COALESCE(cs1.status,'TAKEN') AS period1_status,

    c2.subject_name AS period2,
    COALESCE(cs2.status,'TAKEN') AS period2_status,

    c3.subject_name AS period3,
    COALESCE(cs3.status,'TAKEN') AS period3_status,

    c4.subject_name AS period4,
    COALESCE(cs4.status,'TAKEN') AS period4_status,

    c5.subject_name AS period5,
    COALESCE(cs5.status,'TAKEN') AS period5_status,

    c6.subject_name AS period6,
    COALESCE(cs6.status,'TAKEN') AS period6_status

FROM student_academics sa

JOIN time_table tt
ON sa.sem = tt.sem
AND sa.branch = tt.branch
AND sa.section = tt.section

LEFT JOIN course c1 ON tt.period1 = c1.c_id
LEFT JOIN course c2 ON tt.period2 = c2.c_id
LEFT JOIN course c3 ON tt.period3 = c3.c_id
LEFT JOIN course c4 ON tt.period4 = c4.c_id
LEFT JOIN course c5 ON tt.period5 = c5.c_id
LEFT JOIN course c6 ON tt.period6 = c6.c_id

LEFT JOIN class_status cs1
ON cs1.c_id = tt.period1
AND cs1.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)

LEFT JOIN class_status cs2
ON cs2.c_id = tt.period2
AND cs2.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)

LEFT JOIN class_status cs3
ON cs3.c_id = tt.period3
AND cs3.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)

LEFT JOIN class_status cs4
ON cs4.c_id = tt.period4
AND cs4.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)

LEFT JOIN class_status cs5
ON cs5.c_id = tt.period5
AND cs5.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)

LEFT JOIN class_status cs6
ON cs6.c_id = tt.period6
AND cs6.class_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)

WHERE sa.reg_no = ?
AND tt.day = DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY));
`;

// 3. Student Attendance
export const studentAttendanceSql = `
SELECT
    c.c_id,
    c.subject_name,
    c.no_of_classes,

    COUNT(
        CASE
            WHEN a.attendance = 1
            THEN 1
        END
    ) AS attended_classes

FROM course c

LEFT JOIN class_attendance a
ON c.c_id = a.course_id
AND a.reg_no = ?

GROUP BY
    c.c_id,
    c.subject_name,
    c.no_of_classes

ORDER BY c.subject_name;
`;

// 4. Attendance Percentage
export const attendancePercentageSql = `
SELECT

    c.c_id,

    c.subject_name,

    COUNT(
        CASE
            WHEN a.attendance = 1
            THEN 1
        END
    ) AS attended_classes,

    c.no_of_classes,

    ROUND(
        COUNT(
            CASE
                WHEN a.attendance = 1
                THEN 1
            END
        ) * 100.0 / c.no_of_classes,
        2
    ) AS attendance_percentage

FROM course c

LEFT JOIN class_attendance a
ON c.c_id = a.course_id
AND a.reg_no = ?

GROUP BY
    c.c_id,
    c.subject_name,
    c.no_of_classes

ORDER BY c.subject_name;
`;

// 5. Notices from the student's own professors
// A professor "belongs" to this student if they have a professor_timetable
// row matching the student's sem/branch/section (regardless of day) — same
// join shape used by the timetable queries above. Joined against admin to
// show who published each notice.
export const myNoticesSql = `
SELECT DISTINCT
    cn.notice_id,
    cn.title,
    cn.notice,
    cn.notice_date,
    ad.name AS published_by
FROM student_academics sa
JOIN professor_timetable pt
    ON sa.sem = pt.sem
   AND sa.branch = pt.branch
   AND sa.section = pt.section
JOIN class_notice cn
    ON cn.admin_id = pt.admin_id
JOIN admin ad
    ON ad.admin_id = cn.admin_id
WHERE sa.reg_no = ?
ORDER BY cn.notice_date DESC, cn.notice_id DESC;
`;