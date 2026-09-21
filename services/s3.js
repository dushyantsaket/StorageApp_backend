import {
  DeleteObjectsCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_SECRET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  profile: "learningNodejs",
  region: "us-east-1",
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const createUploadSignedUrl = async ({ key, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: "dushyant-storage-app",
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3client, command, {
    expiresIn: 300,
    signableHeaders: new Set(["content-type"]),
  });
  return url;
};

export const createGetSignedUrl = async ({
  key,
  download = false,
  filename,
}) => {
  const command = new GetObjectCommand({
    Bucket: "dushyant-storage-app",
    Key: key,
    ResponseContentDisposition: `${download ? "attachment" : "inline"}; filename=${(encodeURIComponent, filename)}`,
  });
  const url = await getSignedUrl(s3client, command, {
    expiresIn: 300,
    // signableHeaders: new Set(["content-type"]),
  });
  return url;
};

export const getS3FileMetaData = async (key) => {
  const command = new HeadObjectCommand({
    Bucket: "dushyant-storage-app",
    Key: key,
  });

  return await s3client.send(command);
};

export const deleteS3File = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: "dushyant-storage-app",
    Key: key,
  });

  return await s3client.send(command);
};

export const deleteS3Files = async (keys) => {
  if (!keys.length) return null;

  const command = new DeleteObjectsCommand({
    Bucket: "dushyant-storage-app",
    Delete: {
      Objects: keys,
      Quiet: false,
    },
  });

  return await s3client.send(command);
};
