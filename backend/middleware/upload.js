const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "hotel-management",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: (req, file) => {
            return Date.now() + "-" +
                Math.round(Math.random() * 1e9);
        }
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;