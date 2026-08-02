import { Analytics } from "../../models/Analytics.js";
import { getCurrentAnalyticsDate } from "../../utils/date.js";

export async function createTestAnalytics(overrides = {}) {
    return await Analytics.create({
        date: getCurrentAnalyticsDate(),
        paymentsCreated: 1,
        paymentsCaptured: 1,
        totalRevenue: 100,
        ...overrides
    });
}