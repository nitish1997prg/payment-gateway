import { Analytics } from "../models/Analytics.js";
import { getCurrentAnalyticsDate } from "../utils/date.js";
import { withSpan } from "@payment-gateway/shared";

export async function recordPaymentCreated(payment){
    return withSpan("Payment Created",async ()=>{
    const date = getCurrentAnalyticsDate();

    await withSpan("Update Analytics",async ()=>{
        await Analytics.findOneAndUpdate(
        {date},
        {
            $inc: {
                paymentsCreated: 1
            }
        },
        {
            upsert: true,
            returnDocument: 'after'
        }
    );
    });
    
    })
    
}

export async function recordPaymentCaptured(payment){
    return withSpan("Payment Captured",async ()=>{

    const date = getCurrentAnalyticsDate();

    await withSpan("Update Analytics",async ()=>{
         await Analytics.findOneAndUpdate(
        {date},
        {
            $inc: {
                paymentsCaptured: 1,
                totalRevenue: payment.amount
            }
        },
        {
            upsert: true,
            returnDocument: 'after'
        }
    );
    });
   

    });
    
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