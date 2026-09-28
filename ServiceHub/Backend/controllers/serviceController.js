const db = require("../config/db");


// ==========================================
// GET ALL ACTIVE SERVICES
// ==========================================

const getAllServices = async (req, res) => {
    try {
        const [services] = await db.execute(
            `SELECT
                service_id,
                service_name,
                description
             FROM services
             WHERE status = 'ACTIVE'
             ORDER BY service_name`
        );

        res.status(200).json({
            services
        });

    } catch (error) {
        console.error("Get Services Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADD SERVICE TO PROVIDER
// ==========================================

const addProviderService = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            service_id,
            service_charge
        } = req.body;

        if (!service_id || service_charge === undefined) {
            return res.status(400).json({
                message: "Service and service charge are required"
            });
        }

        if (Number(service_charge) < 0) {
            return res.status(400).json({
                message: "Service charge cannot be negative"
            });
        }

        // Find provider profile
        const [provider] = await db.execute(
            `SELECT provider_id
             FROM provider_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (provider.length === 0) {
            return res.status(404).json({
                message: "Please create your provider profile first"
            });
        }

        const providerId = provider[0].provider_id;

        // Check service
        const [service] = await db.execute(
            `SELECT service_id, service_name
             FROM services
             WHERE service_id = ?
             AND status = 'ACTIVE'`,
            [service_id]
        );

        if (service.length === 0) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        // Check if provider already offers this service
        const [existing] = await db.execute(
            `SELECT provider_service_id
             FROM provider_services
             WHERE provider_id = ?
             AND service_id = ?`,
            [providerId, service_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "You already offer this service"
            });
        }

        // Add service
        const [result] = await db.execute(
            `INSERT INTO provider_services
            (
                provider_id,
                service_id,
                service_charge
            )
            VALUES (?, ?, ?)`,
            [
                providerId,
                service_id,
                service_charge
            ]
        );

        res.status(201).json({
            message: "Service added successfully",
            provider_service_id: result.insertId
        });

    } catch (error) {
        console.error("Add Provider Service Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET MY SERVICES
// ==========================================

const getMyServices = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [services] = await db.execute(
            `SELECT
                ps.provider_service_id,
                s.service_id,
                s.service_name,
                s.description,
                ps.service_charge
             FROM provider_services ps
             INNER JOIN provider_profiles pp
                ON ps.provider_id = pp.provider_id
             INNER JOIN services s
                ON ps.service_id = s.service_id
             WHERE pp.user_id = ?
             AND s.status = 'ACTIVE'
             ORDER BY s.service_name`,
            [userId]
        );

        res.status(200).json({
            services
        });

    } catch (error) {
        console.error("Get My Services Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE SERVICE CHARGE
// ==========================================

const updateProviderService = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const { provider_service_id } = req.params;

        const {
            service_charge
        } = req.body;

        if (service_charge === undefined) {
            return res.status(400).json({
                message: "Service charge is required"
            });
        }

        if (Number(service_charge) < 0) {
            return res.status(400).json({
                message: "Service charge cannot be negative"
            });
        }

        const [result] = await db.execute(
            `UPDATE provider_services ps
             INNER JOIN provider_profiles pp
                ON ps.provider_id = pp.provider_id
             SET ps.service_charge = ?
             WHERE ps.provider_service_id = ?
             AND pp.user_id = ?`,
            [
                service_charge,
                provider_service_id,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.status(200).json({
            message: "Service charge updated successfully"
        });

    } catch (error) {
        console.error("Update Provider Service Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// DELETE SERVICE FROM PROVIDER
// ==========================================

const deleteProviderService = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const { provider_service_id } = req.params;

        const [result] = await db.execute(
            `DELETE ps
             FROM provider_services ps
             INNER JOIN provider_profiles pp
                ON ps.provider_id = pp.provider_id
             WHERE ps.provider_service_id = ?
             AND pp.user_id = ?`,
            [
                provider_service_id,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.status(200).json({
            message: "Service removed successfully"
        });

    } catch (error) {
        console.error("Delete Provider Service Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getAllServices,
    addProviderService,
    getMyServices,
    updateProviderService,
    deleteProviderService
};