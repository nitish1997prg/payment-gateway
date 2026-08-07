import {PAYMENT_EVENTS, logger, withSpan} from "@payment-gateway/shared";

export async function handlePaymentEvent(event) {

    switch (event.eventType) {

        case PAYMENT_EVENTS.CREATED:
            console.log("Ignoring payment.created");
            break;

        case PAYMENT_EVENTS.CAPTURED:
            await withSpan("Process Payment Event", async () => {

                logger.info({
                traceId: event.traceId,
                paymentId: event.data.paymentId
            }, "Sending notification");

            });
            break;

        default:
            console.log("Unknown event");
    }

}