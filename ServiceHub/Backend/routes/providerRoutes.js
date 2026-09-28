const express = require("express");

const {
    createProfile,
    getMyProfile,
    updateProfile,
    searchProviders,
    getProviderDetails
} = require("../controllers/providerController");

const authenticateUser = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// CREATE PROFILE
// PROVIDER ONLY
// ==========================================

router.post(
    "/profile",
    authenticateUser,
    requireRole("PROVIDER"),
    createProfile
);


// ==========================================
// GET MY PROFILE
// PROVIDER ONLY
// ==========================================

router.get(
    "/profile",
    authenticateUser,
    requireRole("PROVIDER"),
    getMyProfile
);


// ==========================================
// UPDATE MY PROFILE
// PROVIDER ONLY
// ==========================================

router.put(
    "/profile",
    authenticateUser,
    requireRole("PROVIDER"),
    updateProfile
);

router.get(
    "/search",
    authenticateUser,
    requireRole("CLIENT"),
    searchProviders
);


router.get(
    "/:provider_id",
    authenticateUser,
    requireRole("CLIENT"),
    getProviderDetails
);


module.exports = router;