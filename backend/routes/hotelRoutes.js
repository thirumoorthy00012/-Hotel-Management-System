const express = require("express");

const {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} = require("../controllers/hotelController");

const upload = require("../middleware/upload");

const router = express.Router();

// CREATE //
router.post(
    "/",
    upload.single("image"),
    createHotel
);

// GET ALL //
router.get(
    "/",
    getHotels
);

// GET SINGLE//
router.get(
    "/:id",
    getHotelById
);

// UPDATE //
router.put(
    "/:id",
    upload.single("image"),
    updateHotel
);

// DELETE //
router.delete(
    "/:id",
    deleteHotel
);

module.exports = router;