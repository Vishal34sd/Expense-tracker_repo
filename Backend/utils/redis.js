import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let client = null;

// Connect to remote Redis instance
export const getRedisClient = async () => {
  if (client && client.isOpen) {
    return client;
  }

  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      console.warn("REDIS_URL is not defined in .env");
      return null;
    }

    client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) return false;
          return 1000;
        },
        connectTimeout: 5000,
      },
    });

    client.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });

    await client.connect();
    console.log("Connected to Remote Redis successfully");
    return client;
  } catch (err) {
    console.error("Could not connect to Redis:", err.message);
    client = null;
    return null;
  }
};

// Simple get from cache
export const getCache = async (key) => {
  try {
    const redis = await getRedisClient();
    if (!redis) return null;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis get error:", err.message);
    return null;
  }
};

// Simple set to cache
export const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    const redis = await getRedisClient();
    if (!redis) return;
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.error("Redis set error:", err.message);
  }
};

// Simple invalidate cache by key pattern
export const clearCachePattern = async (pattern) => {
  try {
    const redis = await getRedisClient();
    if (!redis) return;
    const keys = await redis.keys(pattern);
    if (keys && keys.length > 0) {
      await redis.del(keys);
    }
  } catch (err) {
    console.error("Redis clear error:", err.message);
  }
};
