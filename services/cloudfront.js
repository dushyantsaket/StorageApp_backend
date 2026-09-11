// import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

// const privateKey =
//   process.env.CLOUDFRONT_PRIVATE_KEY ?? process.env.CLOUDFRONT_PRIVATEKEY;
// const keyPairId = "E1TJLBT5D75IF3";
// const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // any Date constructor compatible
// const distributionName = `https://d1ztv6wtjosujv.cloudfront.net`;

// export const createCloudFrontGetSignedUrl = ({
//   key,
//   download = false,
//   filename,
// }) => {
//   const url = `${distributionName}/${key}`;
//   // ?response-content-disposition=${encodeURIComponent(`${download ? "attachment" : "inline"}; filename=${filename}`)}`;
//   const signedUrl = getSignedUrl({
//     url,
//     keyPairId,
//     dateLessThan,
//     privateKey,
//   });
//   return signedUrl;
// };

// // https://bibwild.wordpress.com/2024/06/18/cloudfront-in-front-of-s3-using-response-content-disposition/

import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // ESM
import { readFile } from "fs/promises";

const privateKey = process.env.CLOUDFRONT_PRIVATEKEY;
const keyPairId = "E1TJLBT5D75IF3";
// const dateLessThan = "2026-09-02"; // any Date constructor compatible
const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toISOString();
const distribustionName = `https://d1ztv6wtjosujv.cloudfront.net`;

export const createCloudFrontGetSignedUrl = ({
  key,
  download = false,
  filename,
}) => {
  const url = `${distribustionName}/${key}`;
  // `?response-content-disposition=${encodeURIComponent(`${download ? "attachment" : "inline"}; filename=${filename}`)}`;
  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });
  console.log(filename, download, key);
  return signedUrl;
  console.log(signedUrl);
};
