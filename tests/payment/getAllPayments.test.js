import "../setup.js";
import { app } from "../../app.js";
import { Payment } from "../../models/Payment.js";
import request from "supertest";
import crypto from "node:crypto";
import { describe, expect, jest, test } from "@jest/globals";
import { createTestPayment } from "../helpers/payment.js";

describe("GET /payments",()=>{
    test("should return 200 with empty database",async ()=>{
        const response = await request(app).get("/payments");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });
    test("should return 200 with single payment",async ()=>{
        const payment = await createTestPayment();

        const response = await request(app).get("/payments");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        amount: 100,
                        currency: "INR",
                        status: "created"
                    }
                )
            ]
               
            )
        )
    });
    test("should return 200 with working pagination",async ()=>{
        const payment1 = await createTestPayment();
        const payment2 = await createTestPayment({amount: 200});

        const response = await request(app).get("/payments").query({
            offset : 1,
            limit: 1
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveLength(1);
        expect(response.body).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining(
                        {
                            amount: 200
                        }
                    )
                ]
            )
        );
    })
})