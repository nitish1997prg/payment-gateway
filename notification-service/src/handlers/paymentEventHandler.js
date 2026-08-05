import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";
import { logger } from "../utils/logger.js";

export function handlePaymentEvent(event) {

    switch (event.eventType) {

        case PAYMENT_EVENTS.CREATED:
            console.log("Ignoring payment.created");
            break;

        case PAYMENT_EVENTS.CAPTURED:
            logger.info(
                {
                    paymentId: event.data.paymentId
                }, "Sending notification"
            );
            break;

        default:
            console.log("Unknown event");
    }

}