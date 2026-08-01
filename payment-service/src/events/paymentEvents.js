import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";


function createPaymentEvent(eventType, payment) {
    return {
        eventType,
        timestamp: new Date().toISOString(),
        data: {
            paymentId: payment.paymentId,
            merchantId: payment.merchantId,
            customerId: payment.customerId,
            referenceId: payment.referenceId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status
        }
    };
}

export function paymentCreatedEvent(payment){
    return createPaymentEvent(PAYMENT_EVENTS.CREATED,payment);
}

export function paymentCapturedEvent(payment){
    return createPaymentEvent(PAYMENT_EVENTS.CAPTURED,payment);
}