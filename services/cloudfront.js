import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { readFileSync } from "fs";

const privateKey = readFileSync(
  "/home/ubuntu/StorageApp_backend/cloudfront-private-key.pem",
  "utf8",
);

// CloudFront Public Key ID
const keyPairId = "K2NPJX7OAFNOZQ";

// StorageApp FILES CloudFront distribution
const distributionName = "https://d1ztv6wtjosujv.cloudfront.net";

export const createCloudFrontGetSignedUrl = ({
  key,
  download = false,
  filename,
}) => {
  const url = `${distributionName}/${key}`;

  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    privateKey,
  });

  console.log("filename:", filename);
  console.log("download:", download);
  console.log("key:", key);
  console.log("SIGNED URL:", signedUrl);

  return signedUrl;
};
