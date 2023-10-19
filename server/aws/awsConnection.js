const config = require("../config/config");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.aws.s3.accessKeyID,
    secretAccessKey: config.aws.s3.secretAccessKey,
  },
  region: config.aws.s3.region,
  // endpoint: config.aws.s3.endpoint
});

const s3Storage = multerS3({
  s3: s3,
  bucket: config.aws.s3.bucket,
  key: function (req, file, cb) {
    const extension = file.originalname.split(".")[1];
    cb(null, `plugin/${file.fieldname}/${Date.now().toString()}.${extension}`);
    // cb(null, `plugin/${file.fieldname}/${file.originalname}`);
  },
});

module.exports = s3Storage;
