const express = require("express")
const pool = require("../db/pool")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const result = require("../utils/result")
const config = require("../utils/config")

const router = express.Router()



// router.post('/register-to-course', (req, res) => {

//   const { name, email, course_id, mobile_no } = req.body;

//   const studentSql =
//     `INSERT INTO students (name, email, course_id, mobile_no)
//      VALUES (?, ?, ?, ?)`;

//   pool.query(studentSql, [name, email, course_id, mobile_no], (err, result1) => {

//     if (err) {
//       return res.send(result.createResult(err, null));
//     }

//     const userSql =
//       `INSERT INTO users (email) VALUES (?)`;

//     pool.query(userSql, [email], (err2, result2) => {
//       res.send(result.createResult(err2, {
//         student: result1,
//         user: result2
//       }));
//     });

//   });
// });


/*
router.post('/register-to-course', (req, res) => {
  console.log("register api hit")

  const { name, email, course_id, mobile_no } = req.body

  // validation
  if (!name || !email || !course_id || !mobile_no) {
    return res.send(result.createResult("All fields are required"))
  }

  //  default password
  const defaultPassword = "sunbeam"
  const encryptedPassword = CryptoJS.SHA256(defaultPassword).toString()

  // insert into users (PARENT)
  const userSql = `
    INSERT INTO users (email, password, role)
    VALUES (?, ?, 'STUDENT')
  `

  pool.query(userSql, [email, encryptedPassword], (err, userResult) => {
    if (err) {
      return res.send(result.createResult(err))
    }

    //  insert into students (CHILD)
    const studentSql = `
      INSERT INTO students (name, email, course_id, mobile_no)
      VALUES (?, ?, ?, ?)
    `

    pool.query(
      studentSql,
      [name, email, course_id, mobile_no],
      (err2, studentResult) => {
        if (err2) {
          return res.send(result.createResult(err2))
        }

        res.send(
          result.createResult(null, {
            message: "Student registered successfully",
            defaultPassword: "sunbeam",
            user: userResult,
            student: studentResult
          })
        )
      }
    )
  })
})

router.post("/login", (req, res) => {
  const { email, password } = req.body;
 const hashedPassword = CryptoJS.SHA256(password).toString();
 // 🔹 ADMIN LOGIN (HARDCODED)
  if (
    email === config.ADMIN_EMAIL &&
    password === config.ADMIN_PASSWORD
  ) {
    const payload = {
      email,
      role: "admin"
    };

    const token = jwt.sign(payload, config.SECRET);

    return res.send(
      result.createResult(null, {
        email,
        role: "admin",
        token
      })
    );
  }
  const sql = "SELECT * FROM users WHERE email = ? AND password=?";

  pool.query(sql, [email, hashedPassword], (error, data) => {
        if (error)
            res.send(result.createResult(error))
        else if (data.length == 0)
            res.send(result.createResult("Invalid email or password"))
        else {
            const user= data[0]
         
            const payload={
                email: user.email,
                role : user.role
            }
            const token=jwt.sign(payload,config.SECRET)
            const userData={
                email : user.email,
                role: user.role,
                token
            }
           
            res.send(result.createResult(null, userData))
        }
    })
})
*/
router.post("/register-to-course", (req, res) => {
  const { name, email, course_id, mobile_no } = req.body

  if (!name || !email || !course_id || !mobile_no) {
    return res.send(result.createResult("All fields are required"))
  }

  pool.getConnection((err, conn) => {
    if (err) return res.send(result.createResult(err))

    conn.beginTransaction(err => {
      if (err) return res.send(result.createResult(err))

      // Check if user exists first
      conn.query("SELECT * FROM users WHERE email = ?", [email], (err, users) => {
        if (err) {
          return conn.rollback(() => { conn.release(); res.send(result.createResult(err)) })
        }

        // Check if student is already registered to this course
        conn.query(
          "SELECT * FROM students WHERE email = ? AND course_id = ?",
          [email, course_id],
          (err, existingRegistrations) => {
            if (err) {
              return conn.rollback(() => {
                conn.release()
                res.send(result.createResult(err))
              })
            }

            if (existingRegistrations.length > 0) {
              conn.release()
              return res.send(result.createResult("You are already registered to this course"))
            }

            const insertUser = (cb) => {
              if (users.length > 0) {
                // User exists, skip insert user
                cb(null)
              } else {
                const password = CryptoJS.SHA256("sunbeam").toString()
                conn.query(
                  "INSERT INTO users (email, password, role) VALUES (?, ?, 'student')",
                  [email, password],
                  (err1) => {
                    if (err1) return cb(err1)
                    cb(null)
                  }
                )
              }
            }

            insertUser((err1) => {
              if (err1) {
                return conn.rollback(() => {
                  conn.release()
                  res.send(result.createResult(err1.sqlMessage))
                })
              }

              conn.query(
                "INSERT INTO students (name, email, course_id, mobile_no) VALUES (?, ?, ?, ?)",
                [name, email, course_id, mobile_no],
                (err2) => {
                  if (err2) {
                    return conn.rollback(() => {
                      conn.release()
                      res.send(result.createResult(err2.sqlMessage))
                    })
                  }

                  conn.commit(err => {
                    conn.release()
                    if (err) {
                      return res.send(result.createResult(err))
                    }

                    res.send(result.createResult(null, {
                      message: "Student registered to course successfully",
                      defaultPassword: users.length > 0 ? "Existing Password" : "sunbeam"
                    }))
                  })
                }
              )
            })
          }
        )
      })
    })
  })
})


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ✅ validation (important)
  if (!email || !password) {
    return res.send(result.createResult("Email and password are required"));
  }

  // 🔹 ADMIN LOGIN
  if (
    email === config.ADMIN_EMAIL &&
    password === config.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email, role: "admin" },
      config.SECRET
    );

    return res.send(
      result.createResult(null, {
        email,
        role: "admin",
        token
      })
    );
  }

  // 🔹 USER LOGIN
  const hashedPassword = CryptoJS.SHA256(password).toString();
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  pool.query(sql, [email, hashedPassword], (error, data) => {
    if (error) {
      return res.send(result.createResult(error));
    }

    if (data.length === 0) {
      return res.send(result.createResult("Invalid email or password"));
    }

    const user = data[0];
    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.SECRET
    );

    return res.send(
      result.createResult(null, {
        email: user.email,
        role: user.role,
        token
      })
    );
  });
});


// Generic User Registration
router.post("/register", (req, res) => {
  const { name, email, mobile_no, password } = req.body

  if (!name || !email || !mobile_no || !password) {
    return res.send(result.createResult("All fields are required"))
  }

  // Check if user already exists
  pool.query("SELECT * FROM users WHERE email = ?", [email], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Check user error:', checkErr)
      return res.status(500).send(result.createResult("Database error. Please try again."))
    }

    if (checkResults.length > 0) {
      return res.status(400).send(result.createResult("Email already exists. Please login instead."))
    }

    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Database connection error:', err)
        return res.status(500).send(result.createResult("Database connection failed. Please try again."))
      }

      conn.beginTransaction((err) => {
        if (err) {
          conn.release()
          console.error('Transaction begin error:', err)
          return res.status(500).send(result.createResult("Failed to start transaction"))
        }

        const hashedPassword = CryptoJS.SHA256(password).toString()

        // Insert User
        conn.query(
          "INSERT INTO users (email, password, role) VALUES (?, ?, 'student')",
          [email, hashedPassword],
          (err1, results) => {
            if (err1) {
              return conn.rollback(() => {
                conn.release()
                console.error('User insert error:', err1)
                const errorMsg = err1.code === 'ER_DUP_ENTRY' ? "Email already exists" : (err1.sqlMessage || "Failed to create user")
                res.status(400).send(result.createResult(errorMsg))
              })
            }

            // Insert Student (Null Course)
            conn.query(
              "INSERT INTO students (name, email, mobile_no) VALUES (?, ?, ?)",
              [name, email, mobile_no],
              (err2, results) => {
                if (err2) {
                  return conn.rollback(() => {
                    conn.release()
                    console.error('Student insert error:', err2)
                    res.status(400).send(result.createResult(err2.sqlMessage || "Failed to create student record"))
                  })
                }

                conn.commit((err) => {
                  if (err) {
                    conn.rollback(() => {
                      conn.release()
                      console.error('Commit error:', err)
                      res.status(500).send(result.createResult("Failed to complete registration"))
                    })
                    return
                  }

                  conn.release()
                  res.send(result.createResult(null, {
                    message: "User registered successfully",
                    email,
                    name
                  }))
                })
              }
            )
          }
        )
      })
    })
  })
})

module.exports = router