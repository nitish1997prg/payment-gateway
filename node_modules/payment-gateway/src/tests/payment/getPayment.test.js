import "../setup.js";
import { app } from "../../app.js";
import { Payment } from "../../models/Payment.js";
import request from "supertest";
import crypto from "node:crypto";
import { describe, expect, jest, test } from "@jest/globals";
import { createTestPayment } from "../helpers/payment.js";

describe("/GET payment/:paymentId",()=>{
    test("should fetch a payment by paymentId with 200",async ()=>{
        const payment = await createTestPayment();

        const response = await request(app).get(`/payments/${payment.paymentId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.paymentId).toBe(payment.paymentId);
        expect(response.body.amount).toBe(100);
    });
    test("should return 404 when payment not found",async ()=>{
        const response = await request(app).get(`/payments/${crypto.randomUUID()}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe("Payment not found!");

    });
});