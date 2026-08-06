import { PAYMENT_EVENTS } from "@payment-gateway/shared";


function createPaymentEvent(eventType, payment,traceId) {
    return {
        traceId,
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

export function paymentCreatedEvent(payment,traceId){
    return createPaymentEvent(PAYMENT_EVENTS.CREATED,payment,traceId);
}

export function paymentCapturedEvent(payment,traceId){
    return createPaymentEvent(PAYMENT_EVENTS.CAPTURED,payment,traceId);
}