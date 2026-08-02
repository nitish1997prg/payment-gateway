import "../setup.js";
import { app } from "../../app.js";
import request from "supertest";
import {describe, test, jest, expect} from "@jest/globals";
import { createTestAnalytics } from "../helpers/analytics.js";

describe("GET /analytics/today",()=>{
    test("should return 200 with todays analytics",async ()=>{
        const [_,__] = await Promise.all(
            [
                createTestAnalytics({totalRevenue: 200, date: "2026-08-01"}),
                createTestAnalytics({totalRevenue:300})
            ]
        );

        const response = await request(app).get("/analytics/today");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        expect(response.body).toEqual(
            expect.objectContaining({
                paymentsCreated: 1,
                paymentsCaptured: 1,
                totalRevenue: 300,
                date: "2026-08-02"
            })
        )
    })
})