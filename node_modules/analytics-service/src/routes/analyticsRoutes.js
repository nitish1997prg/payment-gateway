import express from "express";
import { AnalyticsController } from "../controllers/analyticsController.js";

export const analyticsRoutes = express.Router();

analyticsRoutes.get("/analytics",AnalyticsController.getAnalyticsHistory);
analyticsRoutes.get("/analytics/today",AnalyticsController.getTodaysAnalytics);