import { AnalyticsService } from "../services/analyticsService.js";
import {PAYMENT_EVENTS} from "@payment-gateway/shared";

export async function handlePaymentEvent(event) {

    switch (event.eventType) {

        case PAYMENT_EVENTS.CREATED:
            await AnalyticsService.recordPaymentCreated(event.data);
            break;

        case PAYMENT_EVENTS.CAPTURED:
            await AnalyticsService.recordPaymentCaptured(event.data);
            break;

        default:
            console.log(`[Analytics Service] Ignoring event: ${event.eventType}`);
    }

}