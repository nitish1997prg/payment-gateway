import "../setup.js";
import { app } from "../../app.js";
import request from "supertest";
import { createTestAnalytics } from "../helpers/analytics.js";
import {describe, test, expect, jest} from "@jest/globals"

describe("GET /analytics",()=>{
    test("should return 200 with list of analytics history",async ()=>{
        const [_,__] = await Promise.all(
            [
                createTestAnalytics({totalRevenue: 200, date: "2026-08-01"}),
                createTestAnalytics({totalRevenue:300})
            ]
        );

        const response = await request(app).get('/analytics');

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                paymentsCreated: 1,
                paymentsCaptured: 1,
                totalRevenue: 200,
                date: "2026-08-01"
            }),
            expect.objectContaining({
                paymentsCreated: 1,
                paymentsCaptured: 1,
                totalRevenue: 300,
                date: "2026-08-02"
            })
            ])
           
        );
    });
});