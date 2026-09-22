import crypto from "crypto";

export const verifyGithubSignature = (secret, signature, rawBody) => {
  const realSignature = signature;

  if (!signature) {
    console.log("github signature is missing");
    return false;
  }

  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  console.log({
    realSignature,
    expectedSignature,
  });

  if (realSignature !== expectedSignature) {
    console.log("github signature is not verified");
    return false;
  }

  console.log("github signature is verified");

  return true;
};
