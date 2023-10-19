const multer = require("multer");
const s3Storage = require("../aws/awsConnection");

const checkFileType = (file, cb) => {
  const allowedMimes = [];
  if (file.fieldname === "image") {
    allowedMimes.push("image/jpeg", "image/jpg", "image/png");
  } else if (file.fieldname === "jar") {
    allowedMimes.push("application/java-archive");
  }
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image file type"));
  }
};

// Middleware
const uploadFile = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size
  },
});

module.exports = uploadFile;
