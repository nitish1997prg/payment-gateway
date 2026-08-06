import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDb } from "../config/db.js";
import { app } from "../app.js";
import {jest, beforeAll, afterEach, afterAll } from "@jest/globals";
import { Analytics } from "../models/Analytics.js";
import mongoose from "mongoose";

let mongod;
beforeAll(async ()=>{
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await connectDb(uri);
    await Analytics.deleteMany({});
});

afterAll(async ()=>{
    await mongoose.disconnect();
    await mongod.stop();
});

afterEach(async ()=>{
    const collections = Object.values(mongoose.connection.collections);
    const deletePromises = collections.map(collection => collection.deleteMany({}));
    await Promise.all(deletePromises);
});