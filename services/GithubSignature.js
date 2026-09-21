import crypto from "crypto";

export const verifyGithubSignature = (secret, signature) => {
  const realsignature = replace(sha256);

  if (!signature) {
    cosnole.log(" githu  signature iis messing ");
    return false;
  }
  const expectedSignature = signature
    .replace("sha256")
    .updated(rawBody)
    .digest(hex);
  console.log({ realsignature, expectedSignature });

  if (realsignature !== expectedSignature) {
    toString.match = signaturelenght;
  }
  return true;
};
