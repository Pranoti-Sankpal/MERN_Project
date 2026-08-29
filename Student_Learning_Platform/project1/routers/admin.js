const express = require("express")
const pool = require("../db/pool")
const CryptoJS = require("crypto-js");


const jwt=require("jsonwebtoken")
const result=require("../utils/result")
const config=require("../utils/config")
const { checkAuthorization } = require("../utils/auth");


const router=express.Router()


//get all active courses
router.get('/all-active-courses', (req,res) => {
   const sql = ` SELECT * FROM courses WHERE start_date <= CURDATE()AND end_date >= CURDATE() `
  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
   })
})


//get all courses

router.get('/all-courses', (req, res) => {
  const { start_date, end_date } = req.query

  let sql = `SELECT * FROM courses`

  if (start_date && end_date) {
    sql += ` WHERE start_date >= '${start_date}' AND end_date <= '${end_date}'`
  }

  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
  })
})

//add new courses
router.post('/addCourse', checkAuthorization,(req, res) => {
  const { course_name,description,fees,start_date,end_date,video_expire_days} = req.body

  const sql = `INSERT INTO courses(course_name, description, fees, start_date, end_date, video_expire_days) VALUES (?, ?, ?, ?, ?, ?)`

  pool.query(
    sql,
    [course_name, description, fees, start_date, end_date, video_expire_days],
    (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})


//updatate a course by course_id
router.put("/update/:courseId",checkAuthorization, (req, res) => {
  const { courseId } = req.params
  const { course_name, description,fees, start_date, end_date,video_expire_days} = req.body

  const sql = ` UPDATE courses SET course_name = ?, description = ?, fees = ?,start_date = ?, end_date = ?, video_expire_days = ?
    WHERE course_id = ?`

  pool.query( sql, [course_name, description, fees, start_date, end_date, video_expire_days, courseId], (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})


//delete a course by course_id
router.delete("/delete/:courseId",checkAuthorization,(req, res) => {
  const { courseId } = req.params

  const sql = `DELETE FROM courses WHERE course_id = ?`

  pool.query(sql, [courseId], (error, data) => {
    res.send(result.createResult(error, data))
  })
})

// entrolled students based on course_id
router.get("/enrolled-students",checkAuthorization, (req, res) => {
  const { course_id } = req.query;

  if (!course_id) {
    return res.send(result.createResult("courseId is required", null));
  }

  const sql = `
    SELECT 
      s.reg_no,
      s.name,
      s.email,
      s.mobile_no,
      c.course_id,
      c.course_name
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    WHERE c.course_id = ?
    ORDER BY s.name
  `;

  pool.query(sql, [course_id], (err, data) => {
    res.send(result.createResult(err, data));
  });
});

module.exports = router;
 