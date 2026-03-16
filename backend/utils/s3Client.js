const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { createReadStream } = require("fs");
const path = require("path");

require("dotenv").config();

const s3Client = new S3Client({ 
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  }
});

const uploadToS3 = async (file) => {
  try {
    const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: createReadStream(file.path),
      },
    });

    await upload.done();
    return fileName;
  }
  catch (err) {
    throw err;
  }
};

module.exports = { uploadToS3 };