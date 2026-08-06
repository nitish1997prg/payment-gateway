import "../config/env.js";
import axios from "axios";

const MERCHANT_WEBHOOK_URL = process.env.MERCHANT_WEBHOOK_URL;

export async function sendWebhook(event){
    try {
        console.log(
            `[Webhook] Sending ${event.eventType} to ${MERCHANT_WEBHOOK_URL}`
        );

        const response = await axios.post(
            MERCHANT_WEBHOOK_URL,
            event
        );

        console.log("[Webhook] Delivery successful.");

        return response.data;

    }catch(error){
        console.error(
            "[Webhook] Delivery failed:",
            error.message
        );

        throw error;
    }
}