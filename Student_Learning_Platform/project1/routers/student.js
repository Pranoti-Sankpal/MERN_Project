const express = require("express")
const pool = require("../db/pool")
const result = require("../utils/result")

const router = express.Router()

const { checkAuthorization } = require("../utils/auth");



// change password
const CryptoJS = require("crypto-js");

router.put("/change-password", (req, res) => {
  const { email, newPassword, confirmpassword } = req.body;

  if (newPassword !== confirmpassword) {
    return res.status(400).json({
      message: "New password and confirm password do not match"
    });
  }

  const hashedPassword = CryptoJS.SHA256(newPassword).toString();

  const sql = `UPDATE users SET password = ? WHERE email = ?`;

  pool.query(sql, [hashedPassword, email], (error, data) => {
    res.send(result.createResult(error, data));
  });
});



// get all registered courses of a student
router.get('/my-courses', (req, res) => {
  const { email } = req.query;
  const sql = `SELECT *
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    WHERE s.email = ?
  `;

  pool.query(sql, [email], (error, data) => {
    res.send(result.createResult(error, data));
  })
});






//get all registered courseso of a student along  with valid videos
router.get("/my-course-videos", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const sql = `
SELECT s.name, c.course_name, v.title, v.youtube_url
FROM students s
JOIN courses c ON s.course_id = c.course_id
JOIN videos v ON c.course_id = v.course_id
WHERE s.email = ?`;

  pool.query(sql, [email], (error, data) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  });
});

//get all active courses
router.get('/all-active-courses', (req, res) => {
  const sql = ` SELECT * FROM courses WHERE start_date <= CURDATE()AND end_date >= CURDATE() `
  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
  })
})









// get all available courses
router.get("/all-courses", (req, res) => {
  const sql = `SELECT * FROM courses`;
  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data));
  });
});

module.exports = router;