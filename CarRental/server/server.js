import express from "express";
import 'dotenv/config';   // ✅ correct
import cors from "cors";
console.log("JWT_SECRET:", process.env.JWT_SECRET);
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";

const app = express();

// Connect DB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"));

app.use('/api/user', userRouter);
app.use('/api/owner',ownerRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
