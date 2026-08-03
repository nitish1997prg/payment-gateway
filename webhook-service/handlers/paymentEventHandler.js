import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";
import { sendWebhook } from "../services/webhookService.js";
import { webhookDeliveryQueue } from "../queue/webhookQueue.js";

export async function handlePaymentEvent(event) {
    try {
        switch (event.eventType) {

        case PAYMENT_EVENTS.CAPTURED:
            console.log("Inside payments events captured state");
            await webhookDeliveryQueue.add("deliver-webhook",event,{
                attempts: 5,
                backoff: {
                    type: "exponential",
                    delay: 2000
                }
            });
            break;

        default:
            console.log(`[Webhook Service] Ignoring event: ${event.eventType}`);
    }

    }catch(error){
        console.error("[handlePaymentEvent] error !",error);
        throw error;
    }

}