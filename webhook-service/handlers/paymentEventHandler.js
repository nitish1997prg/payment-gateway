import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";
import { sendWebhook } from "../services/webhookService.js";
import { webhookDeliveryQueue } from "../queue/webhookQueue.js";
import { logger } from "../utils/logger.js";
import { withSpan } from "../telemetry/withSpan.js";
import { injectTraceContext } from "../telemetry/propagation.js";

export async function handlePaymentEvent(event) {
    try {
        switch (event.eventType) {

        case PAYMENT_EVENTS.CAPTURED:
            console.log("Inside payments events captured state");
            await withSpan("Enqueue Webhook Delivery",async (span)=>{
                 span.setAttributes({
                    "payment.paymentId": event.data.paymentId,
                    "payment.eventType": event.eventType,
                    "payment.traceId": event.traceId,
                    "payment.merchantId": event.data.merchantId
                });
                await webhookDeliveryQueue.add("deliver-webhook",{
                    ...event,
                    traceContext: injectTraceContext()
                },{
                attempts: 5,
                backoff: {
                    type: "exponential",
                    delay: 2000
                }
            });
            })
           
            logger.info({
                traceId: event.traceId,
            },"Added job inside webhook BullMQ Queue")
            break;

        default:
            console.log(`[Webhook Service] Ignoring event: ${event.eventType}`);
    }

    }catch(error){
        console.error("[handlePaymentEvent] error !",error);
        throw error;
    }

}