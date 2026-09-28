const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// =========================
// REGISTER
// =========================
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;

        // Basic validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Only CLIENT and PROVIDER can register normally
        if (role && !["CLIENT", "PROVIDER"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const userRole = role || "CLIENT";

        // Check existing email
        const [existingUser] = await db.execute(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Check existing phone
        const [existingPhone] = await db.execute(
            "SELECT user_id FROM users WHERE phone = ?",
            [phone]
        );

        if (existingPhone.length > 0) {
            return res.status(409).json({
                message: "Phone number already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.execute(
            `INSERT INTO users
            (name, email, password, phone, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                phone,
                userRole
            ]
        );

        res.status(201).json({
            message: "Registration successful",
            user: {
                user_id: result.insertId,
                name,
                email,
                phone,
                role: userRole
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};



const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.execute(
            `SELECT *
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check account status
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Your account is blocked or inactive"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profile_image: user.profile_image
            }
        });

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


module.exports = {
    register,
    login
};