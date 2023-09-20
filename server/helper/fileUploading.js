const config = require("../config/config");
// const { Upload } = require("@aws-sdk/lib-storage");
// const Transform = require("stream").Transform;
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.aws.s3.accessKeyID,
    secretAccessKey: config.aws.s3.secretAccessKey,
  },
  region: config.aws.s3.region,
});

const s3Storage = multerS3({
  s3: s3,
  bucket: config.aws.s3.bucket,
  key: function (req, file, cb) {
    cb(null, "user/" + Date.now().toString());
  },
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg"];
  console.log(file);

  // Check allowed extensions
  const isAllowedExt = true; // fileExts.includes(path.extname(file.originalname.toLowerCase()));

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true); // no errors
  } else {
    // pass error msg to callback, which can be displayed in frontend
    cb("Error: File type not allowed!");
  }
}

// our middleware
const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb file size
  },
});

module.exports = uploadImage;
