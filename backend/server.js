const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const hotelRoutes = require("./routes/hotelRoutes");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

// ===============================
// Static uploaded images
// ===============================

app.use("/uploads", express.static("uploads"));

// ===============================
// Hotel Routes
// ===============================

app.use("/api/hotels", hotelRoutes);

// ===============================
// Home / Test Route
// ===============================

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Hotel Management API is running",
            databaseTime: result.rows[0].now
        });

    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// ===============================
// Create Hotels Table
// ===============================

const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hotels (
                id SERIAL PRIMARY KEY,
                image VARCHAR(255),
                title VARCHAR(150) NOT NULL,
                description TEXT,
                latitude DECIMAL(10, 7) NOT NULL,
                longitude DECIMAL(10, 7) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Hotels table ready");

    } catch (error) {
        console.error("Database initialization error:", error);
    }
};

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server is running on port ${PORT}`);

    await initDatabase();
});