import mongoose from "mongoose";
import { logger } from "../logging/logger.js";

export async function connectMongo(uri) {
    await mongoose.connect(uri);

    logger.info("Connected to MongoDB");
}