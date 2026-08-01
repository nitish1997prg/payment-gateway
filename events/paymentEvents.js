import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";

export function paymentCreatedEvent(payment){
    return {
        eventType: PAYMENT_EVENTS.CREATED,
        timestamp: new Date().toISOString(),
        data : {
            paymentId: payment.paymentId,
            merchantId: payment.merchantId,
            referenceId: payment.referenceId,
            customerId: payment.customerId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status
        }
    };
}