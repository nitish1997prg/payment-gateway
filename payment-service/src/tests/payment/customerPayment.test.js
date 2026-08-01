import "../setup.js";
import { app } from "../../app.js";
import { Payment } from "../../models/Payment.js";
import request from "supertest";
import crypto from "node:crypto";
import { describe, expect, jest, test } from "@jest/globals";
import { createTestPayment, findPayment } from "../helpers/payment.js";

describe("POST /payments/paymentId/pay",()=>{
    test("should return 200 with captured payment",async ()=>{
        const createdPayment = await createTestPayment();

        const response = await request(app).post(`/payments/${createdPayment.paymentId}/pay`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe("Payment has been captured successfully!");

        const payment = await findPayment(createdPayment.paymentId);
        expect(payment.status).toBe("captured");
    });
    test("should return 404 when payment is not found",async ()=>{
        const response = await request(app).post(`/payments/${crypto.randomUUID()}/pay`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe("Payment not found!");
    });
    test("should return 409 when payment is already processed",async ()=>{
        const payment = await createTestPayment({status: "captured"});

        const response = await request(app).post(`/payments/${payment.paymentId}/pay`);

        expect(response.statusCode).toBe(409);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe("Payment has already been processed!");
    });
});