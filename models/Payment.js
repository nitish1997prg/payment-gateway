import mongoose, { Schema } from "mongoose";
import {PAYMENT_STATUS} from "../enums/PaymentStatus.js";

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    merchantId: {
        type: Schema.Types.UUID,
        required: true,
        index: true
    },
    referenceId : {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 100 //100 Paise = 1 Rupee
    },
    currency: {
        type: String,
        required: true,
        enum: ["INR"]
    },
    status: {
        type: String,
        enum: PAYMENT_STATUS,
        required: true,
        default: "created"
    },
    customerId: {
        type: Schema.Types.UUID,
        required: true
    }
},{timestamps: true});

export const Payment = mongoose.model('Payment',paymentSchema);