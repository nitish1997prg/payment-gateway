import express from "express";
import { WebhookController } from "../controllers/webhookController.js";

export const webhookRoutes = express.Router();

webhookRoutes.get("/failed",WebhookController.getFailedJobs);
webhookRoutes.post("/failed/:jobId/retry",WebhookController.retryFailedJob);
webhookRoutes.delete("/failed/:jobId",WebhookController.deleteFailedJob);