import "../config/env.js";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

export const connection = new IORedis(REDIS_URL,{
 maxRetriesPerRequest: null
})