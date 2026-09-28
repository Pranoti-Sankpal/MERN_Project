const db = require("../config/db");


// ==========================================
// CREATE PROVIDER PROFILE
// ==========================================

const createProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            city_id,
            address,
            experience_years,
            description,
            charges,
            working_hours,
            availability_status
        } = req.body;

        // Check required fields
        if (!city_id) {
            return res.status(400).json({
                message: "City is required"
            });
        }

        // Check if provider profile already exists
        const [existingProfile] = await db.execute(
            `SELECT provider_id
             FROM provider_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (existingProfile.length > 0) {
            return res.status(409).json({
                message: "Provider profile already exists"
            });
        }

        // Check city
        const [city] = await db.execute(
            `SELECT city_id
             FROM cities
             WHERE city_id = ?
             AND status = 'ACTIVE'`,
            [city_id]
        );

        if (city.length === 0) {
            return res.status(404).json({
                message: "City not found"
            });
        }

        // Create profile
        const [result] = await db.execute(
            `INSERT INTO provider_profiles
            (
                user_id,
                city_id,
                address,
                experience_years,
                description,
                charges,
                working_hours,
                availability_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                city_id,
                address || null,
                experience_years || 0,
                description || null,
                charges || null,
                working_hours || null,
                availability_status || "AVAILABLE"
            ]
        );

        res.status(201).json({
            message: "Provider profile created successfully",
            provider_id: result.insertId
        });

    } catch (error) {

        console.error("Create Provider Profile Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET MY PROFILE
// ==========================================

const getMyProfile = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const [profiles] = await db.execute(
            `SELECT
                pp.provider_id,
                u.user_id,
                u.name,
                u.email,
                u.phone,
                u.profile_image,
                c.city_id,
                c.city_name,
                c.state,
                pp.address,
                pp.experience_years,
                pp.description,
                pp.charges,
                pp.working_hours,
                pp.availability_status
             FROM provider_profiles pp
             INNER JOIN users u
                ON pp.user_id = u.user_id
             INNER JOIN cities c
                ON pp.city_id = c.city_id
             WHERE pp.user_id = ?`,
            [userId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }

        res.status(200).json({
            profile: profiles[0]
        });

    } catch (error) {

        console.error("Get Provider Profile Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

const updateProfile = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const {
            city_id,
            address,
            experience_years,
            description,
            charges,
            working_hours,
            availability_status
        } = req.body;

        const [profile] = await db.execute(
            `SELECT provider_id
             FROM provider_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (profile.length === 0) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }

        if (city_id) {
            const [city] = await db.execute(
                `SELECT city_id
                 FROM cities
                 WHERE city_id = ?
                 AND status = 'ACTIVE'`,
                [city_id]
            );

            if (city.length === 0) {
                return res.status(404).json({
                    message: "City not found"
                });
            }
        }

        await db.execute(
            `UPDATE provider_profiles
             SET
                city_id = COALESCE(?, city_id),
                address = COALESCE(?, address),
                experience_years = COALESCE(?, experience_years),
                description = COALESCE(?, description),
                charges = COALESCE(?, charges),
                working_hours = COALESCE(?, working_hours),
                availability_status = COALESCE(?, availability_status)
             WHERE user_id = ?`,
            [
                city_id,
                address,
                experience_years,
                description,
                charges,
                working_hours,
                availability_status,
                userId
            ]
        );

        res.status(200).json({
            message: "Provider profile updated successfully"
        });

    } catch (error) {

        console.error("Update Provider Profile Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const searchProviders = async (req, res) => {
    try {
        const { city_id, service_id } = req.query;

        let query = `
            SELECT
                pp.provider_id,
                u.user_id,
                u.name,
                u.email,
                u.profile_image,
                c.city_name,
                c.state,
                pp.address,
                pp.experience_years,
                pp.description,
                pp.working_hours,
                pp.availability_status,
                ps.provider_service_id,
                ps.service_charge,
                s.service_id,
                s.service_name
            FROM provider_profiles pp
            JOIN users u
                ON pp.user_id = u.user_id
            JOIN cities c
                ON pp.city_id = c.city_id
            JOIN provider_services ps
                ON pp.provider_id = ps.provider_id
            JOIN services s
                ON ps.service_id = s.service_id
            WHERE u.role = 'PROVIDER'
            AND u.status = 'ACTIVE'
            AND c.status = 'ACTIVE'
            AND s.status = 'ACTIVE'
        `;

        const values = [];

        if (city_id) {
            query += ` AND pp.city_id = ?`;
            values.push(city_id);
        }

        if (service_id) {
            query += ` AND ps.service_id = ?`;
            values.push(service_id);
        }

        query += ` ORDER BY pp.experience_years DESC`;

        const [providers] = await db.execute(query, values);

        res.status(200).json({
            message: "Providers fetched successfully",
            count: providers.length,
            providers
        });

    } catch (error) {
        console.error("Search Providers Error:", error);

        res.status(500).json({
            message: "Failed to search providers",
            error: error.message
        });
    }
};
const getProviderDetails = async (req, res) => {
    try {
        const { provider_id } = req.params;

        const query = `
            SELECT
                pp.provider_id,
                u.user_id,
                u.name,
                u.email,
                u.profile_image,

                c.city_id,
                c.city_name,
                c.state,

                pp.address,
                pp.experience_years,
                pp.description,
                pp.working_hours,
                pp.availability_status

            FROM provider_profiles pp

            JOIN users u
                ON pp.user_id = u.user_id

            JOIN cities c
                ON pp.city_id = c.city_id

            WHERE pp.provider_id = ?
            AND u.role = 'PROVIDER'
            AND u.status = 'ACTIVE'
            AND c.status = 'ACTIVE'
        `;

        const [providers] = await db.execute(query, [provider_id]);

        if (providers.length === 0) {
            return res.status(404).json({
                message: "Provider not found"
            });
        }

        const provider = providers[0];

        // Get provider's services
        const serviceQuery = `
            SELECT
                ps.provider_service_id,
                s.service_id,
                s.service_name,
                s.description,
                ps.service_charge

            FROM provider_services ps

            JOIN services s
                ON ps.service_id = s.service_id

            WHERE ps.provider_id = ?
            AND s.status = 'ACTIVE'
        `;

        const [services] = await db.execute(serviceQuery, [provider_id]);

        provider.services = services;

        res.status(200).json({
            message: "Provider details fetched successfully",
            provider
        });

    } catch (error) {
        console.error("Get Provider Details Error:", error);

        res.status(500).json({
            message: "Failed to fetch provider details",
            error: error.message
        });
    }
};


module.exports = {
    createProfile,
    getMyProfile,
    updateProfile,
    searchProviders,
     getProviderDetails
};