import express from "express";
import { webhookRoutes } from "./routes/webhookRoutes.js";

export const app = express();

app.use(express.json());
app.use("/webhooks",webhookRoutes);