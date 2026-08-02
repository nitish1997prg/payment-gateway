import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";
import { sendWebhook } from "../services/webhookService.js";

export async function handlePaymentEvent(event) {

    switch (event.eventType) {

        case PAYMENT_EVENTS.CAPTURED:
            await sendWebhook(event);
            break;

        default:
            console.log(`[Webhook Service] Ignoring event: ${event.eventType}`);
    }

}