const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const pool = require("./config/db");
const hotelRoutes = require("./routes/hotelRoutes");

const app = express();


// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// Uploaded Images
// ========================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ========================================
// Hotel Routes
// ========================================

app.use(
    "/api/hotels",
    hotelRoutes
);


// ========================================
// Test Route
// ========================================

app.get("/", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT NOW()"
        );

        res.json({
            message:
                "Hotel Management API is running",

            databaseTime:
                result.rows[0].now
        });

    } catch (error) {

        console.error(
            "Database connection error:",
            error
        );

        res.status(500).json({
            message:
                "Database connection failed"
        });
    }
});


// ========================================
// Start Server
// ========================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    async () => {

        console.log(
            `Server is running on port ${PORT}`
        );
    }
);