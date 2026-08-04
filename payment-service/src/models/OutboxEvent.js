import mongoose, {Schema} from "mongoose";
import { AGGREGATE_TYPES } from "../constants/AggregateTypes.js";
import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";
import { PAYMENT_CURRENCIES } from "../constants/PaymentCurrencies.js";
import { PAYMENT_STATUS } from "../enums/PaymentStatus.js";
import { OUTBOX_STATUS } from "../enums/OutboxStatus.js";


const outboxEventSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.UUID,
        required: true,
        unique: true,
        index: true
    },
    aggregateType: {
        type: String,
        enum: AGGREGATE_TYPES,
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
        enum: OUTBOX_STATUS,
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

