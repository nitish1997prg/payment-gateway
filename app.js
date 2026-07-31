import express from "express";
import { paymentRoutes } from "./routes/paymentRoutes.js";

export const app = express();

app.use(express.json());
app.use(paymentRoutes);
