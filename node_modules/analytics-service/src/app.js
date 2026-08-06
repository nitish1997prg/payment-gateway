import express from "express";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";

export const app = express();

app.use(express.json());
app.use(analyticsRoutes);