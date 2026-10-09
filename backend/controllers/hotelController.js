const pool = require("../config/db");

// ========================================
// CREATE HOTEL
// ========================================
const createHotel = async (req, res) => {
    try {
        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        // Cloudinary image URL
        const image = req.file
            ? req.file.path
            : null;

        // Validation
        if (
            !title?.trim() ||
            !description?.trim() ||
            latitude === undefined ||
            latitude === "" ||
            longitude === undefined ||
            longitude === "" ||
            price === undefined ||
            price === ""
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude)) ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                message: "Please enter valid latitude, longitude and price"
            });
        }

        const result = await pool.query(
            `INSERT INTO hotels
            (image, title, description, latitude, longitude, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                image,
                title.trim(),
                description.trim(),
                Number(latitude),
                Number(longitude),
                Number(price)
            ]
        );

        res.status(201).json({
            message: "Hotel created successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Create hotel error:", error);

        res.status(500).json({
            message: "Failed to create hotel"
        });
    }
};


// ========================================
// GET ALL HOTELS
// Search, Price Filter and Pagination
// ========================================
const getHotels = async (req, res) => {
    try {
        const {
            title = "",
            minPrice = "",
            maxPrice = "",
            offset = "0",
            limit = "6"
        } = req.query;

        const pageOffset = Number(offset);
        const pageLimit = Number(limit);

        if (
            !Number.isInteger(pageOffset) ||
            pageOffset < 0 ||
            !Number.isInteger(pageLimit) ||
            pageLimit < 1 ||
            pageLimit > 100
        ) {
            return res.status(400).json({
                message: "Invalid pagination values"
            });
        }

        let query = `
            SELECT *
            FROM hotels
            WHERE 1 = 1
        `;

        const values = [];
        let index = 1;

        if (title.trim()) {
            query += ` AND title ILIKE $${index}`;
            values.push(`%${title.trim()}%`);
            index++;
        }

        if (minPrice !== "") {
            const minimum = Number(minPrice);

            if (!Number.isFinite(minimum)) {
                return res.status(400).json({
                    message: "Invalid minimum price"
                });
            }

            query += ` AND price >= $${index}`;
            values.push(minimum);
            index++;
        }

        if (maxPrice !== "") {
            const maximum = Number(maxPrice);

            if (!Number.isFinite(maximum)) {
                return res.status(400).json({
                    message: "Invalid maximum price"
                });
            }

            query += ` AND price <= $${index}`;
            values.push(maximum);
            index++;
        }

        query += ` ORDER BY id DESC`;
        query += ` LIMIT $${index} OFFSET $${index + 1}`;

        values.push(pageLimit, pageOffset);

        const result = await pool.query(query, values);

        // Count matching hotels
        let countQuery = `
            SELECT COUNT(*) AS count
            FROM hotels
            WHERE 1 = 1
        `;

        const countValues = [];
        let countIndex = 1;

        if (title.trim()) {
            countQuery += ` AND title ILIKE $${countIndex}`;
            countValues.push(`%${title.trim()}%`);
            countIndex++;
        }

        if (minPrice !== "") {
            countQuery += ` AND price >= $${countIndex}`;
            countValues.push(Number(minPrice));
            countIndex++;
        }

        if (maxPrice !== "") {
            countQuery += ` AND price <= $${countIndex}`;
            countValues.push(Number(maxPrice));
            countIndex++;
        }

        const countResult = await pool.query(
            countQuery,
            countValues
        );

        res.status(200).json({
            hotels: result.rows,
            count: Number(countResult.rows[0].count)
        });

    } catch (error) {
        console.error("Get hotels error:", error);

        res.status(500).json({
            message: "Failed to fetch hotels"
        });
    }
};


// ========================================
// GET SINGLE HOTEL
// ========================================
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM hotels WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            message: "Hotel fetched successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Get hotel error:", error);

        res.status(500).json({
            message: "Failed to fetch hotel"
        });
    }
};


// ========================================
// UPDATE HOTEL
// ========================================
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        if (
            !title?.trim() ||
            !description?.trim() ||
            latitude === undefined ||
            latitude === "" ||
            longitude === undefined ||
            longitude === "" ||
            price === undefined ||
            price === ""
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude)) ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                message: "Please enter valid latitude, longitude and price"
            });
        }

        // Cloudinary URL if a new image was uploaded.
        // Otherwise, preserve the existing image.
        const newImage = req.file
            ? req.file.path
            : null;

        let result;

        if (newImage) {
            result = await pool.query(
                `UPDATE hotels
                 SET image = $1,
                     title = $2,
                     description = $3,
                     latitude = $4,
                     longitude = $5,
                     price = $6
                 WHERE id = $7
                 RETURNING *`,
                [
                    newImage,
                    title.trim(),
                    description.trim(),
                    Number(latitude),
                    Number(longitude),
                    Number(price),
                    id
                ]
            );
        } else {
            result = await pool.query(
                `UPDATE hotels
                 SET title = $1,
                     description = $2,
                     latitude = $3,
                     longitude = $4,
                     price = $5
                 WHERE id = $6
                 RETURNING *`,
                [
                    title.trim(),
                    description.trim(),
                    Number(latitude),
                    Number(longitude),
                    Number(price),
                    id
                ]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            message: "Hotel updated successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Update hotel error:", error);

        res.status(500).json({
            message: "Failed to update hotel"
        });
    }
};


// ========================================
// DELETE HOTEL
// ========================================
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM hotels
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            message: "Hotel deleted successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Delete hotel error:", error);

        res.status(500).json({
            message: "Failed to delete hotel"
        });
    }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================
module.exports = {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
};