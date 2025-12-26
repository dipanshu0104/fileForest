const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = process.env.LISTEN_FOLDER;

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(uploadPath, req.userId);
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
  uploadPath,
};
