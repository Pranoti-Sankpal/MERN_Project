import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ success: false, message: "not authorized" });
  }

  try {
    // ✅ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { userId: "..." }

    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.json({ success: false, message: "user not found" });
    }

    next();
  } catch (error) {
    console.log(error.message); // helpful debug
    return res.json({ success: false, message: "not authorized" });
  }
};