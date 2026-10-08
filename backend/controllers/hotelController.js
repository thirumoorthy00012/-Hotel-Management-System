const pool = require("../config/db");


//create hotels//
const createHotel = async (req, res) => {
    try {

        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        const image = req.file
            ? req.file.filename
            : null;


        if (
            !title ||
            !description ||
            !latitude ||
            !longitude ||
            !price
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        const result = await pool.query(
            `INSERT INTO hotels
            (image, title, description, latitude, longitude, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                image,
                title,
                description,
                latitude,
                longitude,
                price
            ]
        );


        res.status(201).json({
            message: "Hotel created successfully",
            hotel: result.rows[0]
        });


    } catch (error) {

        console.error(
            "Create hotel error:",
            error
        );

        res.status(500).json({
            message: "Failed to create hotel"
        });
    }
};



//get all hotels//
const getHotels = async (req, res) => {

    try {

        const {
            title = "",
            minPrice = "",
            maxPrice = "",
            offset = 0,
            limit = 6
        } = req.query;


       //hotel query//
        let query = `
            SELECT *
            FROM hotels
            WHERE 1 = 1
        `;


        let values = [];
        let index = 1;


        // Title search
        if (title) {

            query += `
                AND title ILIKE $${index}
            `;

            values.push(`%${title}%`);

            index++;
        }


        // Minimum price
        if (minPrice) {

            query += `
                AND price >= $${index}
            `;

            values.push(minPrice);

            index++;
        }


        // Maximum price
        if (maxPrice) {

            query += `
                AND price <= $${index}
            `;

            values.push(maxPrice);

            index++;
        }


        // Newest hotels first
        query += `
            ORDER BY id DESC
        `;


        // Pagination
        query += `
            LIMIT $${index}
            OFFSET $${index + 1}
        `;


        values.push(Number(limit));
        values.push(Number(offset));


        const result = await pool.query(
            query,
            values
        );



        // --------------------------------
        // COUNT QUERY
        // --------------------------------

        let countQuery = `
            SELECT COUNT(*)
            FROM hotels
            WHERE 1 = 1
        `;


        let countValues = [];
        let countIndex = 1;


        // Title search
        if (title) {

            countQuery += `
                AND title ILIKE $${countIndex}
            `;

            countValues.push(`%${title}%`);

            countIndex++;
        }


        // Minimum price
        if (minPrice) {

            countQuery += `
                AND price >= $${countIndex}
            `;

            countValues.push(minPrice);

            countIndex++;
        }


        // Maximum price
        if (maxPrice) {

            countQuery += `
                AND price <= $${countIndex}
            `;

            countValues.push(maxPrice);

            countIndex++;
        }


        const countResult = await pool.query(
            countQuery,
            countValues
        );


        const count = Number(
            countResult.rows[0].count
        );



    
//res//
        res.status(200).json({

            hotels: result.rows,

            count: count

        });


    } catch (error) {

        console.error(
            "Get hotels error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch hotels"
        });
    }
};



//get single hotel//
const getHotelById = async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            SELECT *
            FROM hotels
            WHERE id = $1
            `,
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

        console.error(
            "Get hotel error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch hotel"
        });
    }
};



//update hotel//
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


        const newImage = req.file
            ? req.file.filename
            : null;


        let result;


        // If new image uploaded
        if (newImage) {

            result = await pool.query(
                `
                UPDATE hotels
                SET
                    image = $1,
                    title = $2,
                    description = $3,
                    latitude = $4,
                    longitude = $5,
                    price = $6
                WHERE id = $7
                RETURNING *
                `,
                [
                    newImage,
                    title,
                    description,
                    latitude,
                    longitude,
                    price,
                    id
                ]
            );

        } else {

            // Keep old image
            result = await pool.query(
                `
                UPDATE hotels
                SET
                    title = $1,
                    description = $2,
                    latitude = $3,
                    longitude = $4,
                    price = $5
                WHERE id = $6
                RETURNING *
                `,
                [
                    title,
                    description,
                    latitude,
                    longitude,
                    price,
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

        console.error(
            "Update hotel error:",
            error
        );

        res.status(500).json({
            message: "Failed to update hotel"
        });
    }
};



//delet hotel//
const deleteHotel = async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            DELETE FROM hotels
            WHERE id = $1
            RETURNING *
            `,
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

        console.error(
            "Delete hotel error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete hotel"
        });
    }
};



//export//
module.exports = {

    createHotel,

    getHotels,

    getHotelById,

    updateHotel,

    deleteHotel

};