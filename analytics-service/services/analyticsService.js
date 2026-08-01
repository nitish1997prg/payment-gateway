import { Analytics } from "../models/Analytics.js";
import { getCurrentAnalyticsDate } from "../utils/date.js";

export async function recordPaymentCreated(payment){
    const date = getCurrentAnalyticsDate();

    await Analytics.findOneAndUpdate(
        {date},
        {
            $inc: {
                paymentsCreated: 1
            }
        },
        {
            upsert: true,
            new: true
        }
    );
}

export async function recordPaymentCaptured(payment){
    const date = getCurrentAnalyticsDate();

    await Analytics.findOneAndUpdate(
        {date},
        {
            $inc: {
                paymentsCaptured: 1
            }
        },
        {
            upsert: true,
            new: true
        }
    );
}

export async function getAllAnalytics(){
    return await Analytics.find({}).sort({date: -1});
}

export async function getTodaysAnalytics(){
    const date = getCurrentAnalyticsDate();

    const analytics = await Analytics.findOne({date});

    if(!analytics){
        return {
            date,
            paymentsCreated: 0,
            paymentsCaptured: 0,
            totalRevenue: 0
        }
    }

    return analytics;
}

export const AnalyticsService = {
    recordPaymentCreated,
    recordPaymentCaptured,
    getAllAnalytics,
    getTodaysAnalytics
};