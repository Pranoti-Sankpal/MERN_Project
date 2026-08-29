const pool = require('./project1/db/pool');

const sql = "SELECT * FROM courses WHERE course_name LIKE '%MERN 10%'";

pool.query(sql, (error, data) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Found courses:", data);
    }
    process.exit();
});
