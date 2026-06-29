import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app=express();
const PORT=3000
app.use(express.json())
app.use(cors())

//Connecting database

const db=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.SQLP,
    database: 'student_media'
})

db.connect((err)=>{
    if(err){
        console.log("Database connection failed!",err);
        return;
    }
    console.log("database connected successfully!")
})

app.get("/",(req,res)=>{
    res.send("Hello!")
})

app.post("/student/login", (req, res) => {
  const { reg_no, password } = req.body;
//console.log(req.body)
  const sql =
    "SELECT * FROM student_login WHERE reg_no = ? AND password = ?";

  db.query(sql, [reg_no, password], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      res.json({
        success: true,
        student: result[0],
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  });
});

///////////////////////////////////////////////
//STUDENT/MESS SECTION
app.get("/student/mess/:id", (req, res) => {
  const reg_no = req.params.id;

  // 1. Menu
  const menuSql = `
    SELECT m.*
    FROM student s
    JOIN mess_menu m
      ON s.hall_no = m.hall_no
    WHERE s.reg_no = ?
      AND m.week_day IN (
        DAYNAME(CURDATE()),
        DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
      )
    ORDER BY
      FIELD(
        m.week_day,
        DAYNAME(CURDATE()),
        DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
      ),
      FIELD(
        m.meal,
        'Breakfast',
        'Lunch',
        'Dinner'
      );
  `;

  // 2. My Attendance Today
  const attendanceSql = `
    SELECT breakfast, lunch, dinner
    FROM mess_attendance
    WHERE reg_no = ?
    AND attendance_date = CURDATE();
  `;

  // 3. Today's Total Attendance
const totalAttendanceSql = `
SELECT
    IFNULL(SUM(breakfast), 0) AS breakfast,
    IFNULL(SUM(lunch), 0) AS lunch,
    IFNULL(SUM(dinner), 0) AS dinner
FROM mess_attendance
WHERE attendance_date = CURDATE();
`;

  // 4. My Today's Rating
  const myRatingSql = `
    SELECT rating
    FROM mess_rating
    WHERE reg_no = ?
    AND rating_date = CURDATE();
  `;

  // 5. Today's Average Rating
  const todayAvgRatingSql = `
    SELECT ROUND(AVG(rating),2) AS avg_rating
    FROM mess_rating
    WHERE rating_date = CURDATE();
  `;

  // 6. Last Week Average Rating
  const weekAvgRatingSql = `
    SELECT ROUND(AVG(rating),2) AS avg_rating
    FROM mess_rating
    WHERE rating_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                          AND CURDATE();
  `;

  // 7. My Today's Feedback
  const myTodayFeedbackSql = `
    SELECT message
    FROM mess_feedback
    WHERE reg_no = ?
    AND message_date = CURDATE();
  `;

  // 8. My Last Week Feedback
  const myWeekFeedbackSql = `
    SELECT message, message_date
    FROM mess_feedback
    WHERE reg_no = ?
    AND message_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                         AND CURDATE()
    ORDER BY message_date DESC;
  `;

  // 9. Today's All Feedback
  const todayFeedbackSql = `
    SELECT
    s.name,
    f.message
    FROM mess_feedback f
    JOIN student s
    ON f.reg_no = s.reg_no
    WHERE f.message_date = CURDATE()
    ORDER BY f.id DESC;
  `;

  // 10. Last Week All Feedback
  const weekFeedbackSql = `
SELECT
    s.name,
    f.message,
    f.message_date
FROM mess_feedback f
JOIN student s
ON f.reg_no = s.reg_no
WHERE f.message_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY)
 AND CURDATE()
ORDER BY f.message_date DESC, f.id DESC;
  `;

  db.query(menuSql, [reg_no], (err, menu) => {
    if (err) return res.status(500).json(err);

    db.query(attendanceSql, [reg_no], (err, attendance) => {
      if (err) return res.status(500).json(err);

      db.query(totalAttendanceSql, (err, totalAttendance) => {
        if (err) return res.status(500).json(err);

        db.query(myRatingSql, [reg_no], (err, myRating) => {
          if (err) return res.status(500).json(err);

          db.query(todayAvgRatingSql, (err, todayAvg) => {
            if (err) return res.status(500).json(err);

            db.query(weekAvgRatingSql, (err, weekAvg) => {
              if (err) return res.status(500).json(err);

              db.query(myTodayFeedbackSql, [reg_no], (err, myTodayFeedback) => {
                if (err) return res.status(500).json(err);

                db.query(myWeekFeedbackSql, [reg_no], (err, myWeekFeedback) => {
                  if (err) return res.status(500).json(err);

                  db.query(todayFeedbackSql, (err, todayFeedback) => {
                    if (err) return res.status(500).json(err);

                    db.query(weekFeedbackSql, (err, weekFeedback) => {
                      if (err) return res.status(500).json(err);

                      res.json({
                        success: true,

                        menu,

                        attendance:
                          attendance.length > 0
                            ? attendance[0]
                            : null,

                        totalAttendance:
                          totalAttendance.length > 0
                            ? totalAttendance[0]
                            : null,

                        myRating:
                          myRating.length > 0
                            ? myRating[0]
                            : null,

                        todayAverageRating:
                          todayAvg.length > 0
                            ? todayAvg[0]
                            : null,

                        weeklyAverageRating:
                          weekAvg.length > 0
                            ? weekAvg[0]
                            : null,

                        myTodayFeedback:
                          myTodayFeedback.length > 0
                            ? myTodayFeedback[0]
                            : null,
                            

                        myWeekFeedback,

                        todayFeedback,
                        weekFeedback,
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

app.post("/student/mess/:id", (req, res) => {
  const reg_no = req.params.id;
  const { attendence, formData } = req.body;

  // Attendance
  if (attendence) {
    const meal = attendence[0];   // Breakfast/Lunch/Dinner
    const status = attendence[1]; // 0 or 1

    let column = "";

    if (meal === "Breakfast") column = "breakfast";
    else if (meal === "Lunch") column = "lunch";
    else column = "dinner";

    const attendanceSql = `
        INSERT INTO mess_attendance
        (reg_no, attendance_date, ${column})
        VALUES (?, CURDATE(), ?)
        ON DUPLICATE KEY UPDATE
        ${column} = VALUES(${column});
    `;

    db.query(attendanceSql, [reg_no, status], (err) => {
        if (err) console.log(err);
    });
}
  // Rating
 if (formData.rating) {

    const ratingSql = `
        INSERT INTO mess_rating
        (reg_no, rating_date, rating)
        VALUES (?, CURDATE(), ?)
        ON DUPLICATE KEY UPDATE
        rating = VALUES(rating);
    `;

    db.query(ratingSql, [reg_no, formData.rating], (err) => {
        if (err) console.log(err);
    });
}

  // Feedback
  if (formData.comment && formData.comment.trim() !== "") {

    const feedbackSql = `
        INSERT INTO mess_feedback
        (reg_no, message, message_date)
        VALUES (?, ?, CURDATE())
        ON DUPLICATE KEY UPDATE
        message = VALUES(message);
    `;

    db.query(feedbackSql, [reg_no, formData.comment], (err) => {
        if (err) console.log(err);
    });
}

  res.json({
    success: true,
    message: "Data saved successfully."
  });
});

app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`)
})