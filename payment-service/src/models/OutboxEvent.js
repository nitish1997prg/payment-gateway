import mongoose, {Schema} from "mongoose";
import { AGGREGATE_TYPES_VALUES, PAYMENT_EVENTS, PAYMENT_CURRENCIES, PAYMENT_STATUS_VALUES, OUTBOX_STATUS_VALUES } from "@payment-gateway/shared";


const outboxEventSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.UUID,
        required: true,
        unique: true,
        index: true
    },
    aggregateType: {
        type: String,
        enum: AGGREGATE_TYPES_VALUES,
        required: true
    },
    aggregateId: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        enum: PAYMENT_EVENTS,
        required: true
    },
    payload: {
        type: Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: OUTBOX_STATUS_VALUES,
        default: "pending",
        index: true
    },
    publishedAt: {
        type: Date,
        default: null
    },
    lastError: {
        type: String,
        default: null
    },
    retryCount: {
        type: Number,
        default: 0
    }

},{timestamps: true});

export const Outbox = mongoose.model("OutboxEvent",outboxEventSchema);

