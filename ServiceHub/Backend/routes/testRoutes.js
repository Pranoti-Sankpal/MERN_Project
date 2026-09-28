const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();


// Any logged-in user
router.get(
    "/profile",
    authenticateUser,
    (req, res) => {
        res.json({
            message: "You are authenticated!",
            user: req.user
        });
    }
);


// CLIENT only
router.get(
    "/client",
    authenticateUser,
    requireRole("CLIENT"),
    (req, res) => {
        res.json({
            message: "Welcome Client! You can access this route."
        });
    }
);


// PROVIDER only
router.get(
    "/provider",
    authenticateUser,
    requireRole("PROVIDER"),
    (req, res) => {
        res.json({
            message: "Welcome Provider! You can access this route."
        });
    }
);


// ADMIN only
router.get(
    "/admin",
    authenticateUser,
    requireRole("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin! You can access this route."
        });
    }
);


module.exports = router;