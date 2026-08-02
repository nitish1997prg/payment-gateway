import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";

export function handlePaymentEvent(event) {

    switch (event.eventType) {

        case PAYMENT_EVENTS.CREATED:
            console.log("Ignoring payment.created");
            break;

        case PAYMENT_EVENTS.CAPTURED:
            console.log(
                `Sending notification for ${event.data.paymentId}`
            );
            break;

        default:
            console.log("Unknown event");
    }

}