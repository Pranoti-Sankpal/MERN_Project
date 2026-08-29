const express = require("express")
const pool = require("../db/pool")
const result = require("../utils/result")
const { checkAuthorization } = require("../utils/auth")

const router=express.Router();


//to get all videos
router.get("/all-videos",checkAuthorization, (req, res) => {
  const { courseId } = req.query;

  let sql = "SELECT * FROM videos";
  let params = [];

  if (courseId) {
    sql += " WHERE course_id=?";
    params.push(courseId);
  }

  pool.query(sql, params, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

//add new video to course
router.post("/add", checkAuthorization,(req, res) => {
  const { courseId, title,  description, youtubeURL} = req.body;

  const sql = `
    INSERT INTO videos(course_id,title,description,youtube_url,added_at)
    VALUES (?,?,?,?,CURDATE())
  `;

  pool.query(
    sql,
    [courseId, title, description, youtubeURL],
    (err, data) => res.send(result.createResult(err, data))
  );
});


//update video by course_id
router.put("/update/:videoId", checkAuthorization, (req, res) => {
  const { videoId } = req.params;
  const { courseId, title, youtubeURL, description } = req.body;

  const sql = `
    UPDATE videos 
    SET course_id=?, title=?, youtube_url=?, description=?
    WHERE video_id=?
  `;

  pool.query(
    sql,
    [courseId, title, youtubeURL, description, videoId],
    (err, data) => res.send(result.createResult(err, data))
  );
});


//delete video by course_id
router.delete("/delete/:videoId",checkAuthorization,  (req, res) => {
  const { videoId } = req.params;

  pool.query(
    "DELETE FROM videos WHERE video_id=?",
    [videoId],
    (err, data) => res.send(result.createResult(err, data))
  );
});



module.exports = router;