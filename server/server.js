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
  const { id } = req.params;

  const sql = `
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

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      menu: result,
    });
  });
});

app.post("/student/mess/:id",(req,res)=>{
  const {reg_no}=req.params;
  const {attendence,formdata}=req.body;
})

app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`)
})