import express from "express";
import PaymentController from "../controllers/paymentController.js";

export const paymentRoutes = express.Router();

paymentRoutes.post('/payments',PaymentController.createPayment);
paymentRoutes.get('/payments/:paymentId',PaymentController.getPayment);
paymentRoutes.get('/payments',PaymentController.getAllPayments);
paymentRoutes.post('/payments/:paymentId/pay',PaymentController.customerPayment);