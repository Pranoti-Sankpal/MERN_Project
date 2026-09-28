const express = require("express");

const {
    getAllServices,
    addProviderService,
    getMyServices,
    updateProviderService,
    deleteProviderService
} = require("../controllers/serviceController");

const authenticateUser = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// GET ALL SERVICES
// CLIENT / PROVIDER / ADMIN
// ==========================================

router.get(
    "/",
    authenticateUser,
    getAllServices
);


// ==========================================
// ADD SERVICE
// PROVIDER ONLY
// ==========================================

router.post(
    "/provider",
    authenticateUser,
    requireRole("PROVIDER"),
    addProviderService
);


// ==========================================
// GET MY SERVICES
// PROVIDER ONLY
// ==========================================

router.get(
    "/provider",
    authenticateUser,
    requireRole("PROVIDER"),
    getMyServices
);


// ==========================================
// UPDATE MY SERVICE
// PROVIDER ONLY
// ==========================================

router.put(
    "/provider/:provider_service_id",
    authenticateUser,
    requireRole("PROVIDER"),
    updateProviderService
);


// ==========================================
// DELETE MY SERVICE
// PROVIDER ONLY
// ==========================================

router.delete(
    "/provider/:provider_service_id",
    authenticateUser,
    requireRole("PROVIDER"),
    deleteProviderService
);


module.exports = router;