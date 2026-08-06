import "../setup.js";
import { app } from "../../app.js";
import { Payment } from "../../models/Payment.js";
import request from "supertest";
import crypto from "node:crypto";
import { describe, expect, jest, test } from "@jest/globals";

describe("POST /payments", ()=>{
    test("should create a payment",async ()=>{
        const response = await request(app).post("/payments").send({
            merchantId: crypto.randomUUID(),
            referenceId: "ORD-101",
            customerId : crypto.randomUUID(),
            amount: 100,
            currency: "INR"
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).not.toBe(null);
        expect(response.body.paymentId).toBeDefined();

        const payment = await Payment.findOne({paymentId: response.body.paymentId});

        expect(payment.amount).toBe(100);
        expect(payment.status).toBe("created");
        expect(payment.currency).toBe("INR");
    });
    test("should return 400 error on missing field",async ()=>{
        const response = await request(app).post("/payments").send({
            merchantId: crypto.randomUUID(),
            amount: 100
        });

        expect(response.statusCode).toBe(400);
    });
    test("should return 400 error on invalid UUID",async ()=>{
        const response = await request(app).post("/payments").send({
            merchantId: "abc",
            referenceId: "ORD-101",
            customerId : crypto.randomUUID(),
            amount: 100,
            currency: "INR"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("MerchantID is not a valid UUID!");
    });
    test("should return 400 error on invalid currency",async ()=>{
        const response = await request(app).post("/payments").send({
            merchantId: crypto.randomUUID(),
            referenceId: "ORD-101",
            customerId : crypto.randomUUID(),
            amount: 100,
            currency: "EUR"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Invalid currency value!");
    });
    test("should return 400 error on invalid amount",async ()=>{
        const response = await request(app).post("/payments").send({
            merchantId: crypto.randomUUID(),
            referenceId: "ORD-101",
            customerId : crypto.randomUUID(),
            amount: -12,
            currency: "EUR"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Amount should be atleast 1!");
    });
})
