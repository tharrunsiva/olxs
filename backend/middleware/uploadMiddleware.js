const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists locally
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate filename using timestamp and keeping the original extension
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];

  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }
  cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
