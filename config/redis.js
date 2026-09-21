import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
  process.exit(1);
});

await redisClient.connect();

export async function setSession(key, session) {
  await redisClient.set(key, JSON.stringify(session));
}

export async function getSession(key) {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
}

export async function getSessionKeysByUserId(userId) {
  const sessionKeys = [];
  let cursor = "0";

  do {
    const scanResult = await redisClient.scan(cursor, { MATCH: "session:*" });
    cursor = scanResult.cursor;

    for (const key of scanResult.keys) {
      const session = await getSession(key);
      if (session && String(session.userId) === String(userId)) {
        sessionKeys.push(key);
      }
    }
  } while (cursor !== "0");

  return sessionKeys;
}

export default redisClient;
