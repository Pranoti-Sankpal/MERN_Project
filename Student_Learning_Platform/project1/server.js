const express = require("express")
const authRouter = require("./routers/auth")
const adminRouter = require("./routers/admin")
const studentRouter = require("./routers/student")
const videoRouter = require("./routers/videos")
const { authUser } = require("./utils/auth")

const app = express()
app.use(express.json())

// public
app.use("/auth", authRouter)

// protected
app.use(authUser)
app.use("/admin", adminRouter)
app.use("/student", studentRouter)
app.use("/videos", videoRouter)

app.listen(2000, () => {
  console.log("Server running at port 2000")
})